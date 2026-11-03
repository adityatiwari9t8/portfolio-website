import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';
import { PROJECTS } from '../data/projects';

const Hero: React.FC = () => (
  <section id="home" className="hero-section page-container">
    <div className="hero-topline">
      <p>Software engineering portfolio</p>
      <p className="hero-availability"><span className="availability-dot" aria-hidden />Open to internships</p>
    </div>
    <h1>Software engineering.<br /><span>From first principles.</span></h1>
    <div className="hero-details">
      <p className="hero-description">I’m Aditya, a Computer Science student focused on backend and full-stack development. I build to understand how software works, and what makes it work well.</p>
      <div className="hero-actions">
        <a href={PROJECTS.length ? '#work' : '#building'} className="button-primary">View selected work <ArrowDown size={16} aria-hidden /></a>
        <a href={SITE.resume} target="_blank" rel="noopener noreferrer" className="button-secondary">View résumé <ArrowUpRight size={16} aria-hidden /></a>
      </div>
    </div>
    <div className="hero-bottomline">
      <span>Gurugram, India <span aria-hidden>·</span> IILM University</span>
      <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer">Explore the code <ArrowUpRight size={14} aria-hidden /></a>
    </div>
  </section>
);
export default Hero;
