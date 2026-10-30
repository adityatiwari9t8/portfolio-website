import React from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { SITE } from '../data/site';
import CopyEmail from './CopyEmail';

interface CallToActionProps { onOpenContact: () => void; }
const CallToAction: React.FC<CallToActionProps> = ({ onOpenContact }) => (
  <div className="contact-surface surface grid gap-8 p-6 sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
    <div>
      <p className="eyebrow">04 / Get in touch</p>
      <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-5xl">Good work starts<br />with a conversation.</h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-600 dark:text-neutral-400">Open to software engineering internships on backend or full-stack teams. Remote, hybrid or on-site.</p>
    </div>
    <div className="min-w-0">
      <div className="flex flex-wrap gap-3">
        <button onClick={onOpenContact} className="button-primary">Get in touch <ArrowUpRight size={16} aria-hidden /></button>
        <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className="button-secondary">Resume <FileText size={16} aria-hidden /></a>
      </div>
      <CopyEmail className="mt-4 -ml-3" />
    </div>
  </div>
);
export default CallToAction;
