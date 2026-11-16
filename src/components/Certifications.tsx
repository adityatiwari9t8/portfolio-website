import { useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { CERTIFICATIONS, type Certification } from '../data/content';
import CertificateViewer from './CertificateViewer';

export default function Certifications() {
  const [selected, setSelected] = useState<Certification | null>(null);
  if (!CERTIFICATIONS.length) return null;

  return (
    <section id="certifications" className="content-width credentials-section" aria-labelledby="certifications-heading">
      <header className="profile-section-heading" data-scroll-reveal><h2 id="certifications-heading">Certifications</h2></header>
      <ul className="credentials" role="list">
        {CERTIFICATIONS.map(item => (
          <li key={item.title} data-scroll-reveal="depth">
            <p className="mono credential-source">{item.issuer}</p>
            <div className="credential-copy">
              <h3>{item.title}</h3>
              {item.note && <p>{item.note}</p>}
            </div>
            {item.url ? (
              <a className="profile-action" href={item.url} target="_blank" rel="noreferrer" aria-label={`Verify ${item.title}`}>
                Verify credential <ArrowUpRight aria-hidden="true" />
              </a>
            ) : item.image && (
              <button type="button" className="profile-action" onClick={() => setSelected(item)} aria-label={`View ${item.title} certificate`}>
                View certificate <Maximize2 aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <CertificateViewer cert={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
