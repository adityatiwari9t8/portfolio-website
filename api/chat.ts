/**
 * POST /api/chat — the "Ask AI" assistant. Streams a plain-text answer from Gemini, grounded in the
 * portfolio's own data (see _profile.ts).
 *
 * Needs GEMINI_API_KEY (a free Google AI Studio key) in the Vercel project's environment variables,
 * or in .env.local for `npm run dev`. Keep billing off on that Google project and it can never cost
 * anything: past the free quota, requests are refused and the chat shows a friendly message instead.
 */
import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import { SITE } from '../src/data/site.js';
import { SYSTEM_INSTRUCTION } from './_profile.js';

/**
 * Free-tier models, tried in order. The free quota is counted per model (5 requests a minute each in testing),
 * so when one is busy the next one answers. All three replied in about 1-3s; gemini-3.8-flash was left out
 * because it took 35-60s on the free tier. GEMINI_MODELS (comma-separated) overrides the list.
 */
const MODELS = (process.env.GEMINI_MODELS || 'gemini-3.6-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const MAX_TURNS = 12; // messages of history sent to the model
const MAX_CHARS = 1000; // per message from the visitor
const LIMIT = 20; // questions per visitor...
const WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes

/**
 * Best-effort per-IP limit. It lives in the function instance's memory, so it resets when the instance
 * is recycled; Google's own free-tier quota is the hard ceiling behind it.
 */
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // never let the map grow without bound
  return recent.length > LIMIT;
};

type Turn = { role: 'user' | 'model'; text: string };

const isTurns = (v: unknown): v is Turn[] =>
  Array.isArray(v) &&
  v.every(
    (t) => t && typeof t === 'object' && (t.role === 'user' || t.role === 'model') && typeof t.text === 'string'
  );

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

const fallback = `Email ${SITE.firstName} at ${SITE.email} and you'll get a direct answer.`;

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return text('Method not allowed', 405);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return text(`The assistant isn't set up yet. ${fallback}`, 503);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (limited(ip)) return text(`That's a lot of questions in a short time. Try again in a few minutes, or ${fallback.toLowerCase()}`, 429);

    let turns: unknown;
    try {
      turns = (await request.json())?.messages;
    } catch {
      return text('Bad request', 400);
    }
    if (!isTurns(turns) || turns.length === 0 || turns[turns.length - 1].role !== 'user') return text('Bad request', 400);

    const contents: Content[] = turns.slice(-MAX_TURNS).map((t) => ({
      role: t.role,
      parts: [{ text: t.text.slice(0, t.role === 'user' ? MAX_CHARS : 4000) }]
    }));
    if (contents[0].role !== 'user') contents.shift(); // history must start with the visitor

    // No SDK retries: by default it retries a rate-limited request up to 5 times with waits of up to a minute,
    // which a visitor experiences as a frozen chat. A busy model is skipped for the next one instead.
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 20_000, retryOptions: { attempts: 1 } } });
    let stream: AsyncGenerator<{ text?: string }> | undefined;
    for (const model of MODELS) {
      try {
        stream = await ai.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            maxOutputTokens: 1024,
            temperature: 0.3,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          }
        });
        break;
      } catch (error) {
        if (error instanceof ApiError && (error.status === 429 || error.status >= 500)) continue; // busy: try the next model
        console.error(`Gemini request failed (${model})`, error);
        return text(`Something went wrong on my side. ${fallback}`, 502);
      }
    }
    if (!stream) return text(`The assistant has reached its free limit for now. ${fallback}`, 429);

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (error) {
          console.error('Gemini stream failed', error);
          controller.enqueue(encoder.encode(`\n\n(The answer was cut off. ${fallback})`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
};
