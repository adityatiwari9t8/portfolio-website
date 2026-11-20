import { lazy, Suspense, useState } from 'react';
import { SITE } from '../../data/site';

const TypographyPreview = import.meta.env.DEV
  ? lazy(() => import('./typography-preview/TypographyPreview'))
  : null;
const previewEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).has('type-preview');

export default function LandingHero() {
  const [typography, setTypography] = useState(previewEnabled ? 'archivo' : 'current');
  const [availability] = SITE.status.split(' · ');

  return (
    <section id="home" className="portfolio-hero" aria-labelledby="cover-title" data-pointer-tilt data-hero-depth>
      <div className="hero-light" aria-hidden="true" />
      <div className="content-width hero-content">
        <div className="hero-name-stage">
          <h1 id="cover-title" className="hero-title" data-type-preview={previewEnabled && typography !== 'current' ? typography : undefined}>
            <span className="hero-greeting">Hey, I’m</span>{' '}
            <span className="hero-name">{SITE.firstName}</span>
          </h1>
        </div>
        <div className="hero-divider" aria-hidden="true" />
        <p className="hero-availability">{availability}</p>
        <div className="hero-actions">
          <a className="hero-primary" href="#work">View projects</a>
          <a className="hero-resume" href={SITE.resume} target="_blank" rel="noreferrer">Résumé</a>
        </div>
        {previewEnabled && TypographyPreview && (
          <Suspense fallback={null}>
            <TypographyPreview selected={typography} onSelect={setTypography} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
