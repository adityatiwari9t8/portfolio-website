import { ArrowUpRight } from 'lucide-react';
import { STORY } from '../../data/content';
import { SITE } from '../../data/site';
import './profile-sections.css';

export default function AboutSection() {
  return (
    <section id="story" className="profile-about" aria-labelledby="about-heading">
      <span id="about" className="about-anchor" aria-hidden="true" />
      <div className="content-width about-spread">
        <div className="about-content" data-scroll-reveal>
          <p className="mono profile-label">About me</p>
          <h2 id="about-heading">
            <span>Curious by nature.</span>{' '}
            <span>Learning by building.</span>
          </h2>
          <p className="profile-intro-text">{STORY.lead}</p>
          <p className="about-note">I like to start with a small example I can follow by hand. With a search algorithm, that means tracing the first few decisions, then comparing my notes with what the solver actually did.</p>
          <a className="profile-action" href={SITE.socials.github} target="_blank" rel="noreferrer">
            See my GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="portrait-stage" data-pointer-tilt data-scroll-reveal="depth">
          <figure className="profile-portrait">
            <img src="/aditya-profile.jpeg" alt="Black-and-white portrait of Aditya Tiwari" loading="lazy" decoding="async" width="662" height="886" />
          </figure>
        </div>
      </div>
    </section>
  );
}
