import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Certification } from '../data/content';
import { useDialog } from '../lib/useDialog';

interface CertificateViewerProps {
  cert: Certification | null;
  onClose: () => void;
}

/** Shows a certificate image full-size on the page, for certificates without a public verification link. */
const CertificateViewer: React.FC<CertificateViewerProps> = ({ cert, onClose }) => {
  const dialog = useRef<HTMLDivElement | null>(null);
  useDialog(!!cert?.image, onClose, dialog);

  if (!cert?.image) return null;

  // Portalled to <body>: the section it lives in is transformed, which would trap a fixed overlay inside it.
  return createPortal(
    <div
      ref={dialog}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 outline-none sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
    >
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md" onClick={onClose} />

      <figure className="fade-up relative w-full max-w-4xl">
        <button
          data-autofocus
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src={cert.image.src}
          width={cert.image.width}
          height={cert.image.height}
          alt={`Certificate of completion: ${cert.title}, ${cert.issuer}`}
          className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-neutral-300">{cert.title}</figcaption>
      </figure>
    </div>,
    document.body
  );
};

export default CertificateViewer;
