import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, LoaderCircle, RotateCcw, Sparkles, Square, X } from 'lucide-react';
import { SITE } from '../data/site';
import { CHAT } from '../data/content';
import { QUICK_ANSWERS } from '../data/quickAnswers';
import { useDialog } from '../lib/useDialog';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One message. `source` says where an answer came from: a prepared quick answer or the AI.
 * `error` turns are shown to the visitor but never sent back to the model as history.
 */
interface Turn {
  role: 'user' | 'model';
  text: string;
  source?: 'quick' | 'ai';
  error?: boolean;
}

/** Starter questions (clicked or typed) get their prepared answer instantly, without calling the AI. */
const quickAnswer = (question: string) =>
  QUICK_ANSWERS.find((q) => q.question.toLowerCase() === question.toLowerCase().replace(/\s+/g, ' '))?.answer;

const MAX_CHARS = 1000;
const FALLBACK = `The assistant isn't reachable right now. Email ${SITE.firstName} at ${SITE.email} and you'll get a direct answer.`;

/** Turns URLs, email addresses and the resume path in an answer into links. Everything else stays plain text. */
const LINK = /(https?:\/\/[^\s)]+[^\s).,]|[\w.+-]+@[\w-]+\.[\w.-]*\w|\/resume\.pdf)/g;
const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`\n]+)`/g, '$1');

const linkify = (text: string) =>
  plain(text).split(LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part;
    return (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
        {part}
      </a>
    );
  });

/**
 * "Ask AI": a chat with an assistant that answers questions about me from the site's own data.
 * A side panel on larger screens, a bottom sheet on phones. Answers stream in from /api/chat.
 */
const ChatPanel: React.FC<ChatPanelProps> = ({ open, onClose }) => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const field = useRef<HTMLTextAreaElement | null>(null);
  const abort = useRef<AbortController | null>(null);

  // Closing the panel stops an answer that is still streaming, so it doesn't use quota nobody reads.
  const close = () => {
    abort.current?.abort();
    onClose();
  };
  useDialog(open, close, dialog);

  // Keep the newest text in view while an answer streams in.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  useEffect(() => () => abort.current?.abort(), []);

  const setLast = (text: string, source?: Turn['source'], error = false) =>
    setTurns((t) => [...t.slice(0, -1), { role: 'model', text, source, error }]);
  const setAnswer = (text: string, error = false) => setLast(text, error ? undefined : 'ai', error);

  /**
   * Shows a prepared answer the way an AI answer arrives: a short "thinking" pause, then the words appear in
   * small bursts. It stays labelled "Quick answer". Stopping or closing shows the rest at once; visitors who
   * prefer reduced motion get it straight away.
   */
  const reveal = async (text: string, signal: AbortSignal) => {
    const wait = (ms: number) =>
      new Promise<void>((done) => {
        const timer = window.setTimeout(done, ms);
        signal.addEventListener('abort', () => (window.clearTimeout(timer), done()), { once: true });
      });
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await wait(still ? 250 : 700 + Math.random() * 400);
    const words = text.split(/(\s+)/);
    for (let i = 0; !still && !signal.aborted && i < words.length; i += 4) {
      setLast(words.slice(0, i + 4).join(''), 'quick');
      await wait(35);
    }
    setLast(text, 'quick');
  };

  const ask = async (question: string) => {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    const prepared = quickAnswer(q);
    const history: Turn[] = [...turns.filter((t) => !t.error && t.text), { role: 'user', text: q }];
    setTurns([...turns, { role: 'user', text: q }, { role: 'model', text: '', source: prepared ? 'quick' : undefined }]);
    setInput('');
    if (field.current) field.current.style.height = '';
    setBusy(true);

    const controller = new AbortController();
    abort.current = controller;
    if (prepared) {
      await reveal(prepared, controller.signal);
      setBusy(false);
      abort.current = null;
      return;
    }
    let answer = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
        signal: controller.signal
      });
      const plain = response.headers.get('Content-Type')?.startsWith('text/plain');
      if (!response.ok || !response.body || !plain) {
        // The endpoint's own error messages are written for visitors; anything else gets the fallback.
        setAnswer(plain ? (await response.text()) || FALLBACK : FALLBACK, true);
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setAnswer(answer);
      }
      if (!answer.trim()) setAnswer(FALLBACK, true);
    } catch {
      // Stopped by the visitor: keep whatever arrived. A network failure: say so.
      if (controller.signal.aborted) setAnswer(answer || 'Stopped.', !answer);
      else setAnswer(FALLBACK, true);
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      ask(input);
    }
  };

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const iconButton =
    'flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-600 transition hover:bg-black/10 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20';

  return (
    <div
      ref={dialog}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-end justify-end outline-none sm:items-stretch sm:p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={close} />

      <section className="fade-up relative flex h-[85svh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-black/5 bg-[#f4f4f2] shadow-2xl sm:h-auto sm:max-w-[420px] sm:rounded-[1.75rem] dark:border-white/10 dark:bg-neutral-900">
        {/* grab handle, phones only */}
        <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-neutral-300 sm:hidden dark:bg-neutral-700" />

        <header className="flex shrink-0 items-start gap-3 border-b border-black/5 px-5 pb-4 pt-3 sm:pt-5 dark:border-white/10">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
            <Sparkles className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="chat-title" className="font-display text-2xl font-bold uppercase leading-none tracking-[-0.01em] text-neutral-950 dark:text-white">
              Ask about <span className="text-neutral-500">{SITE.firstName}</span>
            </h2>
            <p className="mt-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-400">
              AI assistant
            </p>
          </div>
          {turns.length > 0 && (
            <button onClick={() => !busy && setTurns([])} disabled={busy} aria-label="Start over" className={`${iconButton} disabled:opacity-40`}>
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button data-autofocus onClick={close} aria-label="Close" className={iconButton}>
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite">
          {turns.length === 0 ? (
            <div>
              <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{CHAT.intro}</p>
              <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-400">
                Try asking
              </p>
              <ul className="mt-2.5 space-y-2">
                {QUICK_ANSWERS.map(({ question: s }) => (
                  <li key={s}>
                    <button
                      onClick={() => ask(s)}
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.08]"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="space-y-4">
              {turns.map((t, i) =>
                t.role === 'user' ? (
                  <li key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-neutral-950 px-4 py-2.5 text-[15px] leading-relaxed text-white dark:bg-white dark:text-neutral-950">
                    {t.text}
                  </li>
                ) : (
                  <li key={i} className="max-w-[92%]">
                    <div
                      className={`whitespace-pre-wrap rounded-2xl rounded-tl-md px-4 py-3 text-[15px] leading-relaxed ${
                        t.error
                          ? 'border border-amber-500/30 bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200'
                          : 'bg-white text-neutral-800 dark:bg-white/[0.06] dark:text-neutral-200'
                      }`}
                    >
                      {t.text ? (
                        linkify(t.text)
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                          <LoaderCircle aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                          Thinking…
                        </span>
                      )}
                    </div>
                    {t.source && t.text && (
                      <p className="mt-1.5 pl-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400">
                        {t.source === 'quick' ? 'Quick answer · from my profile' : 'AI answer'}
                      </p>
                    )}
                  </li>
                )
              )}
            </ol>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="shrink-0 border-t border-black/5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 dark:border-white/10"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-black/10 bg-white p-1.5 pl-4 focus-within:border-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:focus-within:border-white">
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={field}
              rows={1}
              maxLength={MAX_CHARS}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                grow(e.target);
              }}
              onKeyDown={onKeyDown}
              placeholder={`Ask about ${SITE.firstName}…`}
              className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[16px] text-neutral-950 placeholder:text-neutral-400 focus:outline-none sm:text-[15px] dark:text-white dark:placeholder:text-neutral-500"
            />
            {busy ? (
              <button type="button" onClick={() => abort.current?.abort()} aria-label="Stop the answer" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-950 text-white transition disabled:opacity-30 dark:bg-white dark:text-neutral-950"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 px-1 text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">{CHAT.note}</p>
        </form>
      </section>
    </div>
  );
};

export default ChatPanel;
