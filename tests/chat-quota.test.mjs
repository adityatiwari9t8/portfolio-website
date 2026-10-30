import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

// Compile the production policy and handler; replace only the external SDK transport.
// No test ever loads .env.local or contacts Gemini.
const dir = await mkdtemp(join(tmpdir(), 'portfolio-chat-test-'));
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '--target', 'ES2022', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--skipLibCheck', '--outDir', dir, '--rootDir', process.cwd(), 'api/chat.ts']);
await writeFile(join(dir, 'package.json'), '{"type":"module"}');
const handlerPath = join(dir, 'api/chat.js');
await writeFile(handlerPath, (await readFile(handlerPath, 'utf8')).replace("from '@google/genai'", "from '../fake-gemini.js'"));
await writeFile(join(dir, 'fake-gemini.js'), `
export const state = { calls: 0, status: 0 };
export const ThinkingLevel = { LOW: 'low' };
export class ApiError extends Error { constructor(status) { super('Mock provider response'); this.status = status; } }
export class GoogleGenAI {
  models = { generateContentStream: async () => {
    state.calls++;
    if (state.status) throw new ApiError(state.status);
    return (async function* () { yield { text: 'A mocked answer.' }; })();
  } };
}
`);
const load = (file) => import(pathToFileURL(join(dir, file)).href);
const { getChatQuota, reserveChatQuestion, createChatQuotaStore } = await load('src/lib/chatQuota.js');
const { getQuickAnswer, QUICK_ANSWERS } = await load('src/data/quickAnswers.js');
const { default: handler } = await load('api/chat.js');
const { state } = await load('fake-gemini.js');
const oldKey = process.env.GEMINI_API_KEY;
process.env.GEMINI_API_KEY = 'test-key-no-network';
after(async () => {
  if (oldKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = oldKey;
  await rm(dir, { recursive: true, force: true });
});
const request = (text, ip = 'test-client') => new Request('https://portfolio.test/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
  body: JSON.stringify({ messages: [{ role: 'user', text }] })
});

test('four custom requests fit; the fifth is refused without extending the rolling window', () => {
  let hits = [];
  for (const now of [1000, 2000, 3000, 4000]) {
    const result = reserveChatQuestion(hits, now);
    assert.equal(result.accepted, true);
    hits = result.hits;
  }
  const refused = reserveChatQuestion(hits, 5000);
  assert.equal(refused.accepted, false);
  assert.deepEqual(refused.hits, hits);
  assert.equal(refused.retryAfterMs, 56000);
  assert.equal(getChatQuota(hits, 60999).remaining, 0);
  assert.equal(getChatQuota(hits, 61000).remaining, 1);
  assert.equal(reserveChatQuestion(hits, 61000).accepted, true);
});

test('quota survives a new store (reload) and recovers when the oldest request expires', () => {
  let now = 1000;
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const first = createChatQuotaStore(() => storage, () => now);
  for (let i = 0; i < 4; i++) assert.equal(first.reserve().accepted, true);
  const reloaded = createChatQuotaStore(() => storage, () => now);
  assert.equal(reloaded.reserve().accepted, false);
  now += 60000;
  assert.equal(reloaded.reserve().accepted, true);
  reloaded.backoff(15);
  assert.equal(reloaded.reserve().accepted, false);
  now += 15000;
  assert.equal(reloaded.reserve().accepted, true);
});

test('blocked storage and malformed stored data do not disable the guard', () => {
  const unavailable = createChatQuotaStore(() => { throw new Error('Blocked'); }, () => 1000);
  for (let i = 0; i < 4; i++) unavailable.reserve();
  assert.equal(unavailable.reserve().accepted, false);
  const corrupt = createChatQuotaStore(() => ({ getItem: () => 'invalid json', setItem: () => {} }), () => 1000);
  for (let i = 0; i < 4; i++) corrupt.reserve();
  assert.equal(corrupt.reserve().accepted, false);
});

test('predefined questions accept typing variations', () => {
  const starter = QUICK_ANSWERS[2];
  assert.equal(getQuickAnswer(`  ${starter.question.toUpperCase().replaceAll(' ', '   ')}  `), starter.answer);
  assert.equal(getQuickAnswer('A different question'), undefined);
});

test('API blocks a fifth custom request before calling the provider, but quick answers still work', async () => {
  const before = state.calls;
  for (let i = 0; i < 4; i++) {
    const response = await handler.fetch(request(`Custom question ${i}`));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'A mocked answer.');
  }
  const blocked = await handler.fetch(request('Fifth custom question'));
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('Retry-After')) > 0);
  assert.match(await blocked.text(), /little breather/);
  assert.equal(state.calls - before, 4);
  const quick = await handler.fetch(request(QUICK_ANSWERS[2].question));
  assert.equal(quick.status, 200);
  assert.equal(await quick.text(), QUICK_ANSWERS[2].answer);
  assert.equal(state.calls - before, 4);
});

test('invalid requests do not consume the allowance', async () => {
  assert.equal((await handler.fetch(request('  ', 'invalid-test'))).status, 400);
  for (let i = 0; i < 4; i++) assert.equal((await handler.fetch(request(`Valid ${i}`, 'invalid-test'))).status, 200);
});

test('shared provider exhaustion returns a friendly cooldown with Retry-After', async () => {
  state.status = 429;
  try {
    const response = await handler.fetch(request('Tell me about the projects', 'provider-test'));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Retry-After'), '60');
    assert.match(await response.text(), /ready for your next question shortly/i);
  } finally { state.status = 0; }
});

test('first paint is light by default, including when storage is unavailable', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="theme-color" content="#f4f4f2"/);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const preference of [null, 'light', 'dark', 'blocked']) {
    let dark = false;
    const context = {
      localStorage: { getItem: () => { if (preference === 'blocked') throw new Error('Blocked'); return preference; } },
      document: { documentElement: { classList: { add: () => { dark = true; } } }, querySelector: () => ({ setAttribute() {} }) }
    };
    vm.runInNewContext(script, context);
    assert.equal(dark, preference === 'dark');
  }
});
