import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';
import CopyEmail from './CopyEmail';

interface CallToActionProps { onOpenContact: () => void; }
const CallToAction: React.FC<CallToActionProps> = ({ onOpenContact }) => (
  <div className="page-container contact-section">
    <div className="contact-heading">
      <p className="eyebrow"><span className="availability-dot" aria-hidden /> Open to internships</p>
      <h2>Let’s work<br />together.</h2>
    </div>
    <div className="contact-details">
      <p>I’m looking for a software engineering internship where I can contribute to real systems, learn from the team, and take ownership of my work.</p>
      <div className="hero-actions"><button onClick={onOpenContact} className="button-primary">Get in touch <ArrowUpRight size={16} aria-hidden /></button><a href={SITE.resume} target="_blank" rel="noopener noreferrer" className="text-link">View résumé <ArrowUpRight size={16} aria-hidden /></a></div>
      <CopyEmail className="contact-email" />
    </div>
  </div>
);
export default CallToAction;
