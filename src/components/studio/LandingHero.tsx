import { SITE } from '../../data/site';

export default function LandingHero() {
  const [firstName, ...lastName] = SITE.name.split(' ');
  const [availability] = SITE.status.split(' · ');

  return (
    <section id="home" className="portfolio-hero" aria-labelledby="cover-title" data-pointer-tilt data-hero-depth>
      <div className="hero-light" aria-hidden="true" />
      <div className="content-width hero-content">
        <div className="hero-name-stage">
          <h1 id="cover-title" className="hero-name">
            <span>{firstName}</span>{' '}<span>{lastName.join(' ')}</span>
          </h1>
        </div>
        <div className="hero-divider" aria-hidden="true" />
        <p className="hero-availability">{availability}</p>
        <div className="hero-actions">
          <a className="hero-primary" href="#work">View projects</a>
          <a className="hero-resume" href={SITE.resume} target="_blank" rel="noreferrer">Résumé</a>
        </div>
      </div>
    </section>
  );
}
