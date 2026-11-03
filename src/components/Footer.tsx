import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';
interface FooterProps { onOpenContact: () => void; onOpenChat?: () => void; }
const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenChat }) => (
  <footer className="page-container site-footer">
    <div className="footer-main"><a className="wordmark" href="#home">{SITE.name}<span>.</span></a><nav aria-label="Footer"><a href={SITE.socials.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden /></a><a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden /></a><button onClick={onOpenContact}>Contact <ArrowUpRight size={13} aria-hidden /></button>{onOpenChat && <button onClick={onOpenChat}>Ask about my work <ArrowUpRight size={13} aria-hidden /></button>}</nav></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} {SITE.name}</p><p>{SITE.location}</p><a href="#home">Back to top <ArrowUp size={13} aria-hidden /></a></div>
  </footer>
);
export default Footer;
