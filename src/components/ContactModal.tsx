import React, { useRef } from 'react';
import { ArrowUpRight, Mail, X } from 'lucide-react';
import { SITE } from '../data/site';
import { QUICK_CONTACT } from '../data/content';
import { useDialog } from '../lib/useDialog';
import CopyEmail from './CopyEmail';

interface ContactModalProps { isOpen: boolean; onClose: () => void; }

/** Direct contact channels; no form that implies a message has been delivered. */
const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const dialog = useRef<HTMLDivElement | null>(null);
  useDialog(isOpen, onClose, dialog);
  if (!isOpen) return null;
  return (
    <div ref={dialog} tabIndex={-1} className="fixed inset-0 z-[100] flex items-end justify-center outline-none sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="contact-title" aria-describedby="contact-description">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="surface fade-up relative max-h-[90svh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-b-none p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:p-8">
        <button data-autofocus onClick={onClose} aria-label="Close contact" className="icon-button absolute right-3 top-3"><X size={20} aria-hidden /></button>
        <p className="eyebrow pr-10">Open to SWE internships</p>
        <h2 id="contact-title" className="mt-4 font-display text-5xl font-bold uppercase tracking-tight">Let’s talk.</h2>
        <p id="contact-description" className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">Have a role in mind, a project to collaborate on, or a question about my work? Reach me directly.</p>
        <a href={`mailto:${SITE.email}`} className="button-primary mt-6 w-full"><Mail size={18} aria-hidden /> Write an email <ArrowUpRight size={16} aria-hidden /></a>
        <p className="mt-2 text-center text-xs text-neutral-600 dark:text-neutral-400">Opens your email app.</p>
        <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
          <CopyEmail className="w-full justify-center" />
          <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" className="button-secondary mt-3 w-full">Connect on LinkedIn <ArrowUpRight size={16} aria-hidden /></a>
          {QUICK_CONTACT.map((q) => <a key={q.label} href={q.href} target="_blank" rel="noopener noreferrer" className="text-link mt-3">{q.label} <ArrowUpRight size={14} aria-hidden /></a>)}
        </div>
      </div>
    </div>
  );
};
export default ContactModal;
