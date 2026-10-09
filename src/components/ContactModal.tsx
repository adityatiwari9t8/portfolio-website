import React, { useRef, useState } from 'react';
import { X, ChevronDown, Mail } from 'lucide-react';
import { SITE } from '../data/site';
import { CONTACT_OPTIONS, QUICK_CONTACT } from '../data/content';
import { useDialog } from '../lib/useDialog';
import CopyEmail from './CopyEmail';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERESTS = CONTACT_OPTIONS;

const INPUT =
  'w-full rounded-2xl border border-black/5 bg-neutral-50 px-5 py-3.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10';

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' });

  const dialog = useRef<HTMLDivElement | null>(null);
  useDialog(isOpen, onClose, dialog);

  if (!isOpen) return null;

  // No backend needed: this opens the visitor's email app with the message pre-filled.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${form.interest || 'Hello'} | ${form.name}`;
    const body = `${form.message}\n\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div ref={dialog} tabIndex={-1} className="fixed inset-0 z-[100] flex items-center justify-center p-3 outline-none sm:p-4" role="dialog" aria-modal="true" aria-label="Get in touch">
      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md" onClick={onClose} />

      <div className="fade-up relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-black/5 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
        <button
          data-autofocus
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 sm:right-6 sm:top-6 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-10">
          <h2 className="pr-10 font-display text-4xl font-bold uppercase tracking-[-0.01em] text-neutral-950 sm:text-5xl dark:text-white">
            Let&rsquo;s <span className="text-neutral-500">talk</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            Send a note and it opens in your email app, addressed to{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">{SITE.email}</span>.
          </p>

          {QUICK_CONTACT.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_CONTACT.map((q) => (
                <a
                  key={q.label}
                  href={q.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                >
                  {q.label}
                </a>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={INPUT} placeholder="Name" aria-label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={INPUT} type="email" placeholder="Email" aria-label="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="relative">
              <select
                required
                aria-label="What is this about"
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className={`${INPUT} appearance-none pr-12 ${form.interest ? '' : 'text-neutral-600 dark:text-neutral-400'}`}
              >
                <option value="" disabled>
                  What is this about?
                </option>
                {INTERESTS.map((o) => (
                  <option key={o} value={o} className="text-neutral-900">
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>

            <textarea
              className={`${INPUT} resize-none`}
              rows={5}
              placeholder="Your message"
              aria-label="Message"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99] sm:w-auto dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <Mail className="h-4 w-4" />
              Compose email
            </button>
          </form>

          <div className="mt-4 border-t border-black/5 pt-4 dark:border-white/10">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">No email app? Copy the address instead.</p>
            <div className="-ml-4 mt-1">
              <CopyEmail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
