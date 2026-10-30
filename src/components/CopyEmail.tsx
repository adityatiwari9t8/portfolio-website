import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../lib/clipboard';
import { SITE } from '../data/site';

interface CopyEmailProps { tone?: 'auto' | 'dark'; className?: string; }

const CopyEmail: React.FC<CopyEmailProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    const success = await copyText(SITE.email);
    setStatus(success ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), 4000);
  };
  return (
    <div className={`min-w-0 max-w-full ${className}`}>
      <button type="button" onClick={copy} aria-label={`Copy email address: ${SITE.email}`} className="text-link max-w-full rounded-lg px-3 text-left text-[13px]">
        {status === 'copied' ? <Check className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden /> : <Copy className="h-4 w-4 shrink-0" aria-hidden />}
        <span className="break-all">{status === 'copied' ? 'Email address copied' : SITE.email}</span>
      </button>
      <p role="status" className={status === 'failed' ? 'mt-1 px-3 text-xs text-neutral-600 dark:text-neutral-400' : 'sr-only'}>
        {status === 'copied' ? 'Email address copied' : status === 'failed' ? 'Copy is unavailable. Select the email address above to copy it manually.' : ''}
      </p>
    </div>
  );
};
export default CopyEmail;
