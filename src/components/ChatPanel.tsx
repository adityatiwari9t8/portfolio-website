import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, Copy, MessageCircle, RotateCcw, Square, X } from 'lucide-react';
import { SITE } from '../data/site';
import { CHAT } from '../data/content';
import { QUICK_ANSWERS, getQuickAnswer } from '../data/quickAnswers';
import { CHAT_QUOTA_KEY, chatQuota } from '../lib/chatQuota';
import { useDialog } from '../lib/useDialog';
import { copyText } from '../lib/clipboard';
import './chat-panel.css';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

/** Error turns are shown to the visitor and excluded from model history. */
interface Turn {
  role: 'user' | 'model';
  text: string;
  error?: boolean;
}

const MAX_CHARS = 1000;
const QUICK_REPLY_DELAY_MS = 420;
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

function SuggestedQuestions({ onAsk, busy }: { onAsk: (question: string) => void; busy: boolean }) {
  return (
    <ul className="chat-questions" aria-label="Suggested questions" role="list">
      {QUICK_ANSWERS.map(({ question }) => (
        <li key={question}>
          <button type="button" disabled={busy} onClick={() => onAsk(question)}>
            <span>{question}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Ask AI": a chat with an assistant that answers questions about me from the site's own data.
 * A side panel on larger screens, a bottom sheet on phones. Local and live replies share a renderer.
 */
const ChatPanel: React.FC<ChatPanelProps> = ({ open, onClose }) => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [promptsOpen, setPromptsOpen] = useState(false);
  const [awayFromLatest, setAwayFromLatest] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<{ index: number; copied: boolean } | null>(null);
  const inFlight = useRef(false);
  const copyRequest = useRef(0);
  const [, refreshQuota] = useState(0);
  const cooldownSeconds = Math.ceil(chatQuota.read().retryAfterMs / 1000);
  const customPaused = cooldownSeconds > 0 && !getQuickAnswer(input);
  const cooldownTime = `${Math.floor(cooldownSeconds / 60)}:${String(cooldownSeconds % 60).padStart(2, '0')}`;
  const dialog = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const field = useRef<HTMLTextAreaElement | null>(null);
  const abort = useRef<AbortController | null>(null);
  const followLatest = useRef(true);

  // Closing the panel cancels transport and any remaining text animation.
  const close = () => {
    abort.current?.abort();
    copyRequest.current++;
    setPromptsOpen(false);
    onClose();
  };
  useDialog(open, close, dialog);

  // The allowance survives clearing the conversation. Refresh eligibility and cross-tab changes.
  useEffect(() => {
    if (!open) return;
    followLatest.current = true;
    setAwayFromLatest(false);
    const refresh = () => refreshQuota((n) => n + 1);
    const onStorage = (e: StorageEvent) => { if (e.key === CHAT_QUOTA_KEY) refresh(); };
    refresh();
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener('storage', onStorage);
    return () => { window.clearInterval(timer); window.removeEventListener('storage', onStorage); };
  }, [open]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const overlay = dialog.current;
    if (!open || !viewport || !overlay) return;
    const sync = () => {
      overlay.style.setProperty('--chat-viewport', `${viewport.height}px`);
      overlay.style.setProperty('--chat-top', `${viewport.offsetTop}px`);
      if (scroller.current && followLatest.current) scroller.current.scrollTop = scroller.current.scrollHeight;
    };
    sync();
    viewport.addEventListener('resize', sync);
    viewport.addEventListener('scroll', sync);
    return () => {
      viewport.removeEventListener('resize', sync);
      viewport.removeEventListener('scroll', sync);
    };
  }, [open]);

  // Keep the newest text in view while an answer streams in.
  useEffect(() => {
    const el = scroller.current;
    if (el && followLatest.current) el.scrollTop = el.scrollHeight;
  }, [open, turns, promptsOpen]);

  useEffect(() => () => abort.current?.abort(), []);

  const ask = async (question: string) => {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || inFlight.current) return;
    const prepared = getQuickAnswer(q);
    if (!prepared) {
      const quota = chatQuota.reserve();
      refreshQuota((n) => n + 1);
      if (!quota.accepted) return;
    }
    followLatest.current = true;
    setAwayFromLatest(false);
    setPromptsOpen(false);
    setTurns([...turns, { role: 'user', text: q }, { role: 'model', text: '' }]);
    setInput('');
    if (field.current) field.current.style.height = '';

    inFlight.current = true;
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;
    let answer = prepared ?? '';
    let shown = '';
    let finished = false;
    let discarded = false;
    let failed = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealAfter = prepared && !reducedMotion ? performance.now() + QUICK_REPLY_DELAY_MS : 0;
    const render = (text: string) => setTurns((t) => [...t.slice(0, -1), { role: 'model', text, error: failed }]);
    // Pace buffered text consistently whether it was ready locally or arrived over the network.
    // Keep transport and presentation independent: stopping cancels both immediately.
    const presentation = (async () => {
      while (!controller.signal.aborted && !discarded) {
        if (answer.length > shown.length && performance.now() >= revealAfter) {
          const step = reducedMotion ? answer.length : Math.max(4, Math.ceil((answer.length - shown.length) / 35));
          shown = answer.slice(0, shown.length + step);
          render(shown);
        }
        if (finished && shown.length >= answer.length) break;
        await new Promise((resolve) => window.setTimeout(resolve, 25));
      }
    })();
    try {
      if (prepared) return;
      const history = [...turns.filter((t) => !t.error && t.text), { role: 'user', text: q }];
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
        signal: controller.signal
      });
      if (response.status === 429) {
        const retry = Number(response.headers.get('Retry-After'));
        chatQuota.backoff(Number.isFinite(retry) && retry > 0 ? retry : 60);
        refreshQuota((n) => n + 1);
        discarded = true;
        setTurns((t) => t.slice(0, -2));
        setInput(q);
        return;
      }
      const isText = response.headers.get('Content-Type')?.startsWith('text/plain');
      if (!response.ok || !response.body || !isText) {
        failed = true;
        answer = isText ? (await response.text()) || FALLBACK : FALLBACK;
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
        }
        answer += decoder.decode();
        if (!answer.trim()) { failed = true; answer = FALLBACK; }
      }
    } catch {
      if (!controller.signal.aborted) { failed = true; answer = FALLBACK; shown = ''; }
    } finally {
      finished = true;
      await presentation;
      if (controller.signal.aborted && !discarded) {
        failed = !shown;
        render(shown || 'Stopped.');
      }
      inFlight.current = false;
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

  const scrollToLatest = () => {
    followLatest.current = true;
    setAwayFromLatest(false);
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  };

  const askSuggested = (question: string) => {
    scroller.current?.focus({ preventScroll: true });
    void ask(question);
  };

  const reset = () => {
    copyRequest.current++;
    scroller.current?.focus({ preventScroll: true });
    setTurns([]);
    setCopyFeedback(null);
    setPromptsOpen(false);
    scrollToLatest();
  };

  const copyAnswer = async (index: number, answer: string) => {
    const request = ++copyRequest.current;
    const copied = await copyText(plain(answer));
    if (request === copyRequest.current) setCopyFeedback({ index, copied });
  };

  return (
    <div ref={dialog} tabIndex={-1} className="portfolio-chat"
      role="dialog" aria-modal="true" aria-labelledby="chat-title">
      <div className="chat-backdrop" aria-hidden="true" onClick={close} />

      <section className="chat-sheet">
        <header className="chat-header">
          <span className="chat-avatar" aria-hidden="true"><MessageCircle /></span>
          <div className="chat-heading">
            <h2 id="chat-title">Ask about {SITE.firstName}</h2>
            <p>Portfolio assistant</p>
          </div>
          {turns.length > 0 && (
            <button type="button" onClick={reset} disabled={busy} aria-label="Start a new conversation"
              title="Start a new conversation" className="chat-icon-button">
              <RotateCcw aria-hidden="true" />
            </button>
          )}
          <button type="button" data-autofocus onClick={close} aria-label="Close chat" className="chat-icon-button">
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="chat-thread">
          <div ref={scroller} tabIndex={-1} className="chat-feed" onScroll={event => {
            const el = event.currentTarget;
            const nearLatest = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
            followLatest.current = nearLatest;
            setAwayFromLatest(!nearLatest);
          }}>
            {turns.length === 0 ? (
              <div className="chat-welcome">
                <p>{CHAT.intro}</p>
                <SuggestedQuestions onAsk={askSuggested} busy={busy} />
              </div>
            ) : (
              <ol className="chat-messages" aria-label="Conversation" aria-live="polite" aria-busy={busy} role="list">
                {turns.map((turn, index) => {
                  const streaming = busy && index === turns.length - 1;
                  const copyStatus = copyFeedback?.index === index ? copyFeedback.copied : null;
                  return (
                    <li key={index} className="chat-message" data-role={turn.role}>
                      <span className="sr-only">{turn.role === 'user' ? 'You' : 'Portfolio assistant'}</span>
                      <div className="chat-bubble" data-error={turn.error || undefined}>
                        {turn.text ? (
                          <>{streaming ? plain(turn.text) : linkify(turn.text)}{streaming && <span aria-hidden="true" className="chat-caret" />}</>
                        ) : (
                          <span className="chat-loading" role="status">
                            <span aria-hidden="true" className="chat-thinking"><span /><span /><span /></span>
                            Preparing a reply…
                          </span>
                        )}
                      </div>
                      {turn.role === 'model' && turn.text && !streaming && !turn.error && (
                        <div className="chat-answer-actions">
                          <button type="button" onClick={() => void copyAnswer(index, turn.text)} aria-label="Copy answer">
                            {copyStatus === true ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                            {copyStatus === true ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            {turns.length > 0 && promptsOpen && (
              <div id="chat-suggestions" className="chat-more-questions">
                <SuggestedQuestions onAsk={askSuggested} busy={busy} />
              </div>
            )}
          </div>

          {turns.length > 0 && awayFromLatest && (
            <button type="button" className="chat-jump" onClick={() => {
              scroller.current?.focus({ preventScroll: true });
              scrollToLatest();
            }}>
              <ArrowDown aria-hidden="true" /> Latest reply
            </button>
          )}
        </div>

        <form className="chat-form" onSubmit={event => { event.preventDefault(); void ask(input); }}>
          {(turns.length > 0 || cooldownSeconds > 0) && (
            <div className="chat-form-tools">
              {turns.length > 0 && (
                <button type="button" className="chat-suggestions-toggle" disabled={busy} aria-expanded={promptsOpen}
                  aria-controls={promptsOpen ? 'chat-suggestions' : undefined} onClick={() => {
                    scrollToLatest();
                    setPromptsOpen(current => !current);
                  }}>
                  Suggested questions <ChevronDown aria-hidden="true" />
                </button>
              )}
              {cooldownSeconds > 0 && (
                <p className="chat-cooldown" role="status">
                  Custom questions paused <span aria-hidden="true">{cooldownTime}</span>
                </p>
              )}
            </div>
          )}
          <div className="chat-composer">
            <label htmlFor="chat-input" className="sr-only">Your question</label>
            <textarea id="chat-input" ref={field} rows={1} maxLength={MAX_CHARS} value={input} enterKeyHint="send"
              onChange={event => { setInput(event.target.value); grow(event.target); }}
              onKeyDown={onKeyDown} placeholder={`Ask about ${SITE.firstName}…`} />
            {busy ? (
              <button type="button" className="chat-send" onClick={() => abort.current?.abort()} aria-label="Stop the answer">
                <Square aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" className="chat-send" disabled={!input.trim() || customPaused} aria-label="Send">
                <ArrowUp aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="chat-note">{CHAT.note}</p>
          <p className="sr-only" role="status">{copyFeedback ? (copyFeedback.copied ? 'Answer copied.' : 'Copy unavailable. You can select the answer text.') : ''}</p>
        </form>
      </section>
    </div>
  );
};

export default ChatPanel;
