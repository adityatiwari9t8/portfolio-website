import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SITE } from '../../data/site';
import HeroField from './HeroField';

export default function LandingHero() {
  return (
    <section id="home" className="alpine-cover" aria-labelledby="cover-title">
      <HeroField />
      <div className="alpine-content">
        <p className="availability">{SITE.status}</p>
        <h1 id="cover-title">{SITE.name}</h1>
        <p className="alpine-role">Computer science student in Gurugram, India.</p>
        <p className="alpine-description">Open a project to run the demo, inspect the code, and see the trade-offs I made.</p>
        <div className="alpine-actions">
          <a className="solid-link" href="#work">View projects <ArrowDown aria-hidden="true" /></a>
          <a className="resume-link" href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
