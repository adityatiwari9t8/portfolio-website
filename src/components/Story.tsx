import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { STORY, STORY_PHOTOS } from '../data/content';
import { SITE } from '../data/site';

const Story: React.FC = () => (
  <div className="page-container about-grid">
    <div className="about-copy">
      <p className="eyebrow">About me</p>
      <h2>Curious by nature.<br /><span>Learning by building.</span></h2>
      <p className="about-lead">{STORY.lead}</p>
      <p>{STORY.more}</p>
      <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" className="text-link">See how I build <ArrowUpRight size={16} aria-hidden /></a>
    </div>
    <figure className="about-portrait">
      <div><img src={STORY_PHOTOS[0].src} alt={STORY_PHOTOS[0].alt} loading="lazy" decoding="async" width={662} height={886} className="portrait" /></div>
      <figcaption><span>{SITE.name}</span><span>{SITE.location}</span></figcaption>
    </figure>
  </div>
);
export default Story;
