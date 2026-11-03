import React from 'react';
import { ArrowUpRight, ArrowRight, Github } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { BUILDING, WORK } from '../data/content';
import { studyHref } from '../lib/route';
import { studyLinkClick } from '../lib/transition';
import ProjectMedia from './ProjectMedia';

interface ProjectsProps { onOpenDemo: (project: Project) => void; }
const currentBuild = BUILDING.find((project) => project.status === 'In progress');
const orderedProjects = [...PROJECTS].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

const Projects: React.FC<ProjectsProps> = ({ onOpenDemo }) => (
  <div className="page-container">
    <div className="section-heading work-heading">
      <div><h2>{WORK.title}{WORK.accent && <span> {WORK.accent}</span>}</h2></div>
      <p>{WORK.description}</p>
    </div>
    <div className="work-grid">
      {orderedProjects.map((p, i) => (
        <article key={p.id} data-media-host className={`work-card ${i === 0 ? 'work-card-featured' : ''}`}>
          <div className="work-card-copy">
            <p className="eyebrow">{p.category}{p.sample ? ' · Concept project' : ''}</p>
            <h3>{p.title}</h3>
            <p className="work-summary">{p.summary ?? p.description}</p>
            <div className="project-actions">
              <a href={studyHref(p.id)} onClick={studyLinkClick(p.id, studyHref(p.id))} className="text-link">Read case study <ArrowRight size={16} aria-hidden /></a>
              {p.demo ? <button onClick={() => onOpenDemo(p)} className="text-link">Try it live <ArrowUpRight size={16} aria-hidden /></button> : p.live ? <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-link">Live site <ArrowUpRight size={16} aria-hidden /></a> : null}
            </div>
            <div className="project-meta"><span>{p.study.stack.slice(0, 2).join(' / ')}</span>{p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${p.title}`}><Github size={15} aria-hidden /> Source</a>}</div>
          </div>
          <div className="work-stage">
            <a href={studyHref(p.id)} onClick={studyLinkClick(p.id, studyHref(p.id))} aria-label={`Explore ${p.title}`} data-vt={p.id} className="work-preview">
              <ProjectMedia project={p} mode="card" />
              <span className="preview-cue" aria-hidden><ArrowUpRight size={20} /></span>
            </a>
          </div>
        </article>
      ))}
    </div>
    {currentBuild && !PROJECTS.some((p) => p.id === currentBuild.id) && <aside className="in-progress" aria-labelledby="current-build-title">
      <div><p className="eyebrow"><span className="availability-dot" aria-hidden /> Currently building</p><h3 id="current-build-title">{currentBuild.title}<span> / In progress</span></h3></div>
      <p>A booking backend built around one question: what happens when everyone wants the same seat?</p>
      <ul>{currentBuild.aims.map(aim => <li key={aim}>{aim}</li>)}</ul>
    </aside>}
  </div>
);
export default Projects;
