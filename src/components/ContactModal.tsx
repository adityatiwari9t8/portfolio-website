import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight, ArrowRight, Linkedin, Check, Copy, Mail } from 'lucide-react';
import { SITE } from '../data/site';
import { QUICK_CONTACT } from '../data/content';
import { useDialog } from '../lib/useDialog';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INPUT =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[16px] text-neutral-950 placeholder:text-neutral-400 transition focus:border-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-950/5 sm:text-[15px] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10';
const LABEL = 'mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-400';
const CHANNEL =
  'inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full border border-black/10 px-3.5 text-[13px] font-medium text-neutral-800 transition hover:bg-black/5 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10';

/** Copies text, falling back to a hidden textarea where the async clipboard API is missing. */
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const t = document.createElement('textarea');
    t.value = text;
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand('copy');
    } catch {
      /* nothing else to try */
    }
    document.body.removeChild(t);
  }
};

/**
 * "Get in touch": a short form (name, email, message) and the direct channels under it.
 * No backend: sending opens the visitor's email app with everything filled in. In case no app opens,
 * a line under the button offers to copy the message instead.
 * A sheet from the bottom on phones, a centred card on larger screens.
 */
const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<'email' | 'message' | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  useDialog(isOpen, onClose, dialog);

  // Reopening starts fresh (the draft itself is kept).
  useEffect(() => {
    if (isOpen) setSent(false);
  }, [isOpen]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!isOpen) return null;

  const subject = `Software engineering internship | ${form.name}`;
  const body = `${form.message}\n\n${form.name}\n${form.email}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async (what: 'email' | 'message') => {
    await copyText(what === 'email' ? SITE.email : `To: ${SITE.email}\nSubject: ${subject}\n\n${body}`);
    setCopied(what);
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div
      ref={dialog}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-end justify-center outline-none sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md" onClick={onClose} />

      <div className="fade-up relative max-h-[92svh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] border border-black/5 bg-[#f4f4f2] shadow-2xl sm:rounded-[1.75rem] dark:border-white/10 dark:bg-neutral-900">
        {/* grab handle, phones only */}
        <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-neutral-300 sm:hidden dark:bg-neutral-700" />

        <button
          data-autofocus
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-600 transition hover:bg-black/10 sm:right-5 sm:top-5 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:p-8">
          <p className="flex items-start gap-2 pr-12 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-400">
            <span className="pulse-dot mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            Open to SWE internships
          </p>
          <h2 id="contact-title" className="mt-3 font-display text-[2.6rem] font-bold uppercase leading-none tracking-[-0.01em] text-neutral-950 sm:text-5xl dark:text-white">
            Let&rsquo;s <span className="text-neutral-500">talk</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Hiring for a software engineering internship, or have a question about my work? Send a note and I&rsquo;ll get back to you.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className={LABEL}>Name</label>
                <input id="c-name" className={INPUT} autoComplete="name" placeholder="Your name" required value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label htmlFor="c-email" className={LABEL}>Email</label>
                <input id="c-email" className={INPUT} type="email" autoComplete="email" placeholder="you@company.com" required value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <label htmlFor="c-message" className={LABEL}>Message</label>
              <textarea
                id="c-message"
                className={`${INPUT} resize-none`}
                rows={4}
                placeholder="The role, the team, or what you'd like to know."
                required
                value={form.message}
                onChange={set('message')}
              />
            </div>

            <button
              type="submit"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Send message
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </button>

            <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400" aria-live="polite">
              {sent ? (
                <>
                  <Check className="mr-1 inline h-3.5 w-3.5 text-emerald-500" aria-hidden />
                  Opened in your email app. Nothing happened?{' '}
                  <button type="button" onClick={() => copy('message')} className="font-semibold text-neutral-900 underline underline-offset-2 dark:text-white">
                    {copied === 'message' ? 'Copied' : 'Copy the message'}
                  </button>
                </>
              ) : (
                'Opens in your email app with everything filled in.'
              )}
            </p>
          </form>

          {/* the direct ways in, for anyone who would rather skip the form */}
          <div className="mt-6 border-t border-black/10 pt-5 dark:border-white/10">
            <p className={LABEL}>Or reach me directly</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <button type="button" onClick={() => copy('email')} className={CHANNEL}>
                {copied === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden /> : <Mail className="h-3.5 w-3.5" aria-hidden />}
                <span className="truncate">{copied === 'email' ? 'Email copied' : SITE.email}</span>
                {copied !== 'email' && <Copy className="h-3 w-3 shrink-0 opacity-50" aria-hidden />}
              </button>
              <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" className={CHANNEL}>
                <Linkedin className="h-3.5 w-3.5" aria-hidden />
                LinkedIn
                <ArrowUpRight className="h-3 w-3 opacity-50" aria-hidden />
              </a>
              {QUICK_CONTACT.map((q) => (
                <a key={q.label} href={q.href} target="_blank" rel="noopener noreferrer" className={CHANNEL}>
                  {q.label}
                  <ArrowUpRight className="h-3 w-3 opacity-50" aria-hidden />
                </a>
              ))}
            </div>
            <span role="status" aria-live="polite" className="sr-only">
              {copied === 'email' ? 'Email address copied' : copied === 'message' ? 'Message copied' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
