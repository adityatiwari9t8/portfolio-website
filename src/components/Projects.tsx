import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { BUILDING, WORK } from '../data/content';
import { studyHref } from '../lib/route';
import { studyLinkClick } from '../lib/transition';
import ProjectMedia from './ProjectMedia';
import SectionTitle from './SectionTitle';

interface ProjectsProps { onOpenDemo: (project: Project) => void; }

const currentBuild = BUILDING.find((project) => project.status === 'In progress');
const orderedProjects = [...PROJECTS].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

/** Featured work leads automatically; current explorations remain available below. */
const Projects: React.FC<ProjectsProps> = ({ onOpenDemo }) => (
  <div>
    <SectionTitle label="01 / Work" before={WORK.title} accent={WORK.accent} sub={WORK.description} />
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {orderedProjects.map((p, i) => (
        <article key={p.id} data-media-host className={`project-card surface flex min-w-0 flex-col overflow-hidden ${p.featured ? 'md:col-span-2 lg:col-span-3 md:grid md:grid-cols-2' : ''}`}>
          <div className="project-cover relative border-b border-black/10 p-3 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <span className="eyebrow">{p.featured ? 'Featured project' : p.year ?? String(i + 1).padStart(2, '0')}</span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{p.category}</span>
            </div>
            {p.demo ? (
              <button onClick={() => onOpenDemo(p)} aria-label={`Open ${p.title} demo`} data-vt={p.id} className="project-preview group relative block w-full overflow-hidden rounded-lg">
                <ProjectMedia project={p} mode="card" />
                <span aria-hidden className="preview-cue"><ArrowUpRight size={18} /></span>
              </button>
            ) : (
              <a href={studyHref(p.id)} onClick={studyLinkClick(p.id, studyHref(p.id))} aria-label={`Read the ${p.title} case study`} data-vt={p.id} className="project-preview group relative block overflow-hidden rounded-lg">
                <ProjectMedia project={p} mode="card" />
                <span aria-hidden className="preview-cue"><ArrowUpRight size={18} /></span>
              </a>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            {p.sample && <p className="eyebrow mb-2">Concept project</p>}
            <h3 className="text-xl font-semibold leading-tight tracking-[-0.035em]">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{p.summary ?? p.description}</p>
            <ul aria-label="Technologies" className="mb-5 mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              {p.study.stack.slice(0, 3).map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
            {p.highlights[0] && <div className="mt-auto border-t border-black/10 pt-4 dark:border-white/10">
              <p className="text-sm font-medium">{p.highlights[0].value}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{p.highlights[0].label}</p>
            </div>}
            <div className="flex flex-wrap items-center gap-2 pt-5">
              {p.demo ? (
                <button onClick={() => onOpenDemo(p)} className="button-primary button-compact">Try demo <ArrowUpRight size={14} aria-hidden /></button>
              ) : p.live ? (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="button-primary button-compact">Live site <ArrowUpRight size={14} aria-hidden /></a>
              ) : null}
              <a href={studyHref(p.id)} onClick={studyLinkClick(p.id, studyHref(p.id))} className="text-link px-1 text-xs">Case study <ArrowUpRight size={14} aria-hidden /></a>
              {p.demo && p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-link text-xs">Live site <ArrowUpRight size={14} aria-hidden /></a>}
              {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${p.title}`} className="icon-button ml-auto"><Github size={18} aria-hidden /></a>}
            </div>
          </div>
        </article>
      ))}
    </div>
    {currentBuild && !PROJECTS.some((project) => project.id === currentBuild.id) && (
      <aside aria-labelledby="current-build-title" className="current-build mt-6 grid gap-6 rounded-2xl border border-emerald-900/15 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:gap-12 dark:border-emerald-300/20">
        <div>
          <p className="eyebrow flex items-center gap-2 !text-emerald-900 dark:!text-emerald-200"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> Currently building · In progress</p>
          <h3 id="current-build-title" className="mt-3 text-2xl font-semibold tracking-tight">{currentBuild.title}{' '}<span className="mt-1 block text-base sm:ml-3 sm:mt-0 sm:inline font-normal text-neutral-600 dark:text-neutral-400">Booking systems</span></h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">Exploring how to keep ticket bookings reliable when many people try to reserve the same seat.</p>
          <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">A full case study will follow once the build and validation are complete.</p>
        </div>
        <div className="border-t border-emerald-900/15 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0 dark:border-emerald-300/20">
          <p className="eyebrow">Design goals</p>
          <ul className="mt-3 space-y-3">{currentBuild.aims.map((aim, i) => <li key={aim} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"><span className="font-mono text-xs leading-6 text-emerald-800 dark:text-emerald-300">{String(i + 1).padStart(2, '0')}</span><span>{aim}</span></li>)}</ul>
        </div>
      </aside>
    )}
  </div>
);

export default Projects;
