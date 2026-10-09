import React, { useEffect, useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { SITE } from '../data/site';

/** Phone-only bar that keeps the two recruiter actions (resume, contact) one tap away after the hero. */
const MobileBar: React.FC<{ onOpenContact: () => void }> = ({ onOpenContact }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition duration-300 md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-sm gap-2 rounded-full border border-black/5 bg-white/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/90">
        <a
          href={SITE.resume}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
        >
          <FileText className="h-4 w-4" />
          Resume
        </a>
        <button
          onClick={onOpenContact}
          tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950"
        >
          Get in touch
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileBar;
