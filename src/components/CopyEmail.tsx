import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SITE } from '../data/site';

interface CopyEmailProps {
  /** "dark" is for the black closing card, "auto" for normal surfaces. */
  tone?: 'auto' | 'dark';
  className?: string;
}

/** Shows the email address with a one-click copy, for people who don't use a mail app. */
const CopyEmail: React.FC<CopyEmailProps> = ({ tone = 'auto', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // Older browsers: fall back to a temporary textarea.
      const t = document.createElement('textarea');
      t.value = SITE.email;
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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const styles =
    tone === 'dark'
      ? 'text-neutral-300 hover:bg-white/10 hover:text-white dark:text-neutral-600 dark:hover:bg-black/5 dark:hover:text-neutral-950'
      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white';

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${styles} ${className}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      <span>{SITE.email}</span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied' : ''}
      </span>
      {copied && <span aria-hidden className="text-emerald-500">Copied</span>}
    </button>
  );
};

export default CopyEmail;
