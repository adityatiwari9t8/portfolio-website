import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SITE } from '../../data/site';

export default function LandingHero() {
  const [firstName, ...lastName] = SITE.name.split(' ');
  const name = <><span>{firstName}</span>{' '}<span>{lastName.join(' ')}</span></>;

  return (
    <section id="home" className="portfolio-hero" aria-labelledby="cover-title" data-pointer-tilt data-hero-depth>
      <div className="hero-light" aria-hidden="true" />
      <div className="content-width hero-content">
        <div className="hero-name-stage">
          <h1 id="cover-title" className="hero-name">
            <span className="hero-name-depth" aria-hidden="true">{name}</span>
            <span className="hero-name-face">{name}</span>
          </h1>
        </div>
        <div className="hero-meta">
          <p className="hero-availability">{SITE.status}</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#work">View projects <ArrowDown aria-hidden="true" /></a>
            <a className="hero-resume" href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
