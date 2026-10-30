/** Shared rolling-window policy: four custom questions, then wait for the oldest to expire. */
export const CHAT_WINDOW_MS = 60_000;
export const CHAT_QUESTION_LIMIT = 4;
export const CHAT_QUOTA_KEY = 'portfolio-chat-quota-v1';

export function getChatQuota(hits: readonly number[], now = Date.now()) {
  const recent = hits.filter((t) => Number.isFinite(t) && t <= now && t > now - CHAT_WINDOW_MS).sort((a, b) => a - b);
  const remaining = Math.max(0, CHAT_QUESTION_LIMIT - recent.length);
  const retryAt = remaining ? 0 : recent[recent.length - CHAT_QUESTION_LIMIT] + CHAT_WINDOW_MS;
  return { hits: recent, remaining, retryAt, retryAfterMs: Math.max(0, retryAt - now) };
}

export function reserveChatQuestion(hits: readonly number[], now = Date.now()) {
  const quota = getChatQuota(hits, now);
  if (!quota.remaining) return { ...quota, accepted: false };
  return { ...getChatQuota([...quota.hits, now], now), accepted: true };
}

type QuotaState = { hits: number[]; blockedUntil: number };
type QuotaStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Persist across panel closes, Start over, reloads and tabs; memory fallback for blocked storage. */
export function createChatQuotaStore(storage: () => QuotaStorage, clock = Date.now) {
  let memory: QuotaState = { hits: [], blockedUntil: 0 };
  const read = () => {
    try {
      const saved = storage().getItem(CHAT_QUOTA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.hits) && parsed.hits.every((t: unknown) => typeof t === 'number')) {
          memory = { hits: parsed.hits, blockedUntil: Number.isFinite(parsed.blockedUntil) ? parsed.blockedUntil : 0 };
        }
      }
    } catch { /* Private browsing or unavailable storage: retain the in-memory allowance. */ }
    const now = clock();
    const quota = getChatQuota(memory.hits, now);
    memory.hits = quota.hits;
    const retryAt = Math.max(quota.retryAt, memory.blockedUntil);
    return { ...quota, retryAt, retryAfterMs: Math.max(0, retryAt - now) };
  };
  const save = () => {
    try { storage().setItem(CHAT_QUOTA_KEY, JSON.stringify(memory)); } catch { /* Memory fallback. */ }
  };
  return {
    read,
    reserve() {
      const quota = read();
      if (quota.retryAfterMs > 0) return { ...quota, accepted: false };
      const next = reserveChatQuestion(quota.hits, clock());
      memory.hits = next.hits;
      save();
      return next;
    },
    backoff(seconds: number) {
      read();
      memory.blockedUntil = Math.max(memory.blockedUntil, clock() + Math.max(1, seconds) * 1000);
      save();
    }
  };
}

export const chatQuota = createChatQuotaStore(() => window.localStorage);
