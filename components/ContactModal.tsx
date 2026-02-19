import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Contact from './Contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {

  // ⭐ Lock background scroll + ESC close
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="
        relative
        bg-white dark:bg-slate-800
        w-full max-w-full sm:max-w-2xl md:max-w-4xl
        rounded-[2.5rem]
        shadow-2xl
        overflow-y-auto
        max-h-[90vh]
        scrollbar-hide
        animate-in fade-in zoom-in duration-300
      ">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute top-8 right-8 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4">
          <Contact isModal />
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
