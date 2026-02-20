import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Contact from './Contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {

  /* ================= SCROLL LOCK + ESC ================= */
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        p-4
      "
      role="dialog"
      aria-modal="true"
    >

      {/* ================= BACKDROP ================= */}
      <div
        className="
          absolute inset-0
          bg-slate-900/60
          backdrop-blur-md
          transition-opacity duration-300
        "
        onClick={onClose}
      />

      {/* ================= MODAL ================= */}
      <div
        className="
          relative w-full
          max-w-full sm:max-w-2xl md:max-w-4xl

          rounded-[2.5rem]
          overflow-y-auto
          max-h-[90vh]
          scrollbar-hide

          border border-slate-200 dark:border-white/10

          bg-white
          dark:bg-gradient-to-b
          dark:from-slate-900
          dark:to-slate-950

          shadow-2xl

          animate-in fade-in zoom-in duration-300
        "
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Close contact form"
          className="
            absolute top-8 right-8 z-10
            p-2 rounded-full

            bg-slate-100
            dark:bg-white/5

            hover:bg-slate-200
            dark:hover:bg-white/10

            transition-colors
            text-slate-500 dark:text-slate-300
          "
        >
          <X className="w-6 h-6" />
        </button>

        {/* CONTENT */}
        <div className="p-6 md:p-10">
          <Contact isModal />
        </div>

      </div>
    </div>
  );
};

export default ContactModal;
