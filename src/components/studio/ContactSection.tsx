import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react';
import { SITE } from '../../data/site';
import { copyText } from '../../lib/clipboard';
import './closing-sections.css';

type CopyStatus = 'copied' | 'failed' | null;

export default function ContactSection() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const copyReset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestRequest = useRef(0);

  useEffect(() => () => {
    latestRequest.current++;
    clearTimeout(copyReset.current);
  }, []);

  async function copyEmail() {
    const request = ++latestRequest.current;
    const copied = await copyText(SITE.email);
    if (request !== latestRequest.current) return;
    clearTimeout(copyReset.current);
    setCopyStatus(copied ? 'copied' : 'failed');
    copyReset.current = setTimeout(() => setCopyStatus(null), 3500);
  }

  return (
    <footer id="contact" className="portfolio-contact" aria-labelledby="contact-heading">
      <div className="content-width contact-layout">
        <div className="contact-intro">
          <h2 id="contact-heading">Contact</h2>
          <div className="portfolio-email">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <button type="button" onClick={copyEmail} aria-label="Copy email address" title="Copy email address">
              {copyStatus === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </button>
          </div>
          <p className="contact-copy-status" role="status">
            {copyStatus === 'copied' && 'Email copied'}
            {copyStatus === 'failed' && 'Select the email above to copy'}
          </p>
        </div>
        <nav className="contact-links" aria-label="Footer links">
          <a href={SITE.socials.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a>
          <a href={SITE.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
          <a href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a>
        </nav>
        <div className="contact-meta">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <a href="#home">Back to top <ArrowUp aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
}
