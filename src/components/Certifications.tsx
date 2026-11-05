import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CERTIFICATIONS, type Certification } from '../data/content';
import CertificateViewer from './CertificateViewer';

export default function Certifications() {
  const [selected, setSelected] = useState<Certification | null>(null);
  if (!CERTIFICATIONS.length) return null;

  return (
    <section id="certifications" className="content-width certifications-section" aria-labelledby="certifications-heading">
      <header className="resume-heading"><h2 id="certifications-heading">Certifications</h2></header>
      <ul className="credential-list">
        {CERTIFICATIONS.map(item => (
          <li key={item.title}>
            <p className="credential-issuer">{item.issuer}</p>
            <h3>{item.title}</h3>
            {item.note && <p className="credential-note">{item.note}</p>}
            {item.url ? (
              <a className="text-action" href={item.url} target="_blank" rel="noreferrer" aria-label={`Verify ${item.title}`}>
                Verify credential <ArrowUpRight aria-hidden="true" />
              </a>
            ) : item.image && (
              <button className="text-action" onClick={() => setSelected(item)} aria-label={`View ${item.title} certificate`}>
                View certificate <ArrowUpRight aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <CertificateViewer cert={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
