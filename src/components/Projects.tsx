import React from 'react';
import { ArrowUpRight, BookOpen, ExternalLink, Github } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { studyHref } from '../lib/route';
import SectionTitle from './SectionTitle';
import ProjectMedia from './ProjectMedia';
import Tilt from './Tilt';
import Reveal from './Reveal';
import BrowserBar from './BrowserBar';
import CountUp from './CountUp';
import { studyLinkClick } from '../lib/transition';

interface ProjectsProps {
  onOpenDemo: (project: Project) => void;
}

// On phones the text buttons share one row evenly (flex-1); from sm up they size to their labels.
const pill =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white/70 px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-white dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20';

const primary =
  'group/btn inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-neutral-950 px-4 py-2.5 sm:flex-none sm:px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200';

const mediaFrame =
  'block w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)] transition duration-300 dark:border-white/10 dark:bg-neutral-900';

const Projects: React.FC<ProjectsProps> = ({ onOpenDemo }) => (
  <div>
    <Reveal>
      <SectionTitle
        id="work"
        label="Work"
        before="Selected"
        accent="work"
        sub="Things I have built, each with its source code and a case study on the design decisions, the trade-offs and the honest limits."
      />
    </Reveal>

    <div className="mx-auto mt-8 max-w-4xl max-sm:mt-6 sm:mt-12">
      {PROJECTS.map((p, i) => (
        <article
          key={p.id}
          className="mb-8 last:mb-0 max-sm:mb-4 md:sticky"
          style={{ top: `${96 + i * 18}px` }}
        >
          <Reveal variant="scale">
          <Tilt max={3.5} scale={1.01} lift={12} glare radius="rounded-[1.75rem]">
          <div
            data-media-host
            className={`lit group [transform-style:preserve-3d] rounded-[1.75rem] border border-black/5 bg-gradient-to-br p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)] max-sm:rounded-[1.5rem] max-sm:p-4 sm:p-7 dark:border-white/10 ${p.gradient}`}
          >
            <div className="depth-1 flex items-center justify-between font-mono text-[11.5px] max-sm:text-[10.5px] font-medium uppercase tracking-[0.1em] text-neutral-700 dark:text-neutral-300">
              <span>{p.year ?? `Project ${String(i + 1).padStart(2, '0')}`}</span>
              <span className="flex items-center gap-2">
                {p.sample && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                    Sample
                  </span>
                )}
                <span className="rounded-full bg-white/70 px-3 py-1 text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
                  {p.category}
                </span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)] [transform-style:preserve-3d] items-center gap-6 max-sm:mt-4 max-sm:gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-8">
              <div className="depth-1 order-2 [transform-style:preserve-3d] md:order-1">
                <h3 className="text-2xl font-medium leading-tight tracking-[-0.02em] max-sm:text-[1.375rem] text-neutral-950 sm:text-[1.75rem] dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px] dark:text-neutral-400">
                  {p.description}
                </p>
                {p.tryIt && (
                  <p className="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="mr-2 rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-neutral-950">
                      Try it
                    </span>
                    {p.tryIt}
                  </p>
                )}

                <dl className="mt-6 hidden grid-cols-2 gap-4 border-t sm:grid border-black/5 pt-5 dark:border-white/10">
                  {p.highlights.map((h) => (
                    <div key={h.value}>
                      <dt className="text-[15px] font-semibold leading-snug text-neutral-950 dark:text-white"><CountUp text={h.value} /></dt>
                      <dd className="mt-1 text-xs leading-snug text-neutral-600 dark:text-neutral-400">{h.label}</dd>
                    </div>
                  ))}
                </dl>

                <div className="depth-2 mt-6 flex flex-wrap items-center gap-2 max-sm:mt-5">
                  {p.demo ? (
                    <button onClick={() => onOpenDemo(p)} className={primary}>
                      Live demo
                      <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </button>
                  ) : (
                    p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className={primary}>
                        Visit live site
                        <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )
                  )}
                  <a href={studyHref(p.id)} onClick={studyLinkClick(p.id, studyHref(p.id))} className={`${pill} min-w-0 flex-1 sm:flex-none`}>
                    <BookOpen className="hidden h-4 w-4 sm:block" />
                    Case study
                  </a>
                  {p.demo && p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className={pill}>
                      <ExternalLink className="h-4 w-4" />
                      Live site
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`Source code for ${p.title}`} className={pill}>
                      <Github className="h-4 w-4" />
                      {/* icon-only on phones so all three buttons fit on one row */}
                      <span className="hidden sm:inline">Source</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="depth-3 order-1 md:order-2">
              {p.demo ? (
                <button
                  onClick={() => onOpenDemo(p)}
                  aria-label={`Open ${p.title} demo`}
                  data-vt={p.id}
                  className={mediaFrame}
                >
                  <BrowserBar label={`Live demo · ${p.title}`} />
                  <ProjectMedia project={p} mode="card" />
                </button>
              ) : (
                <a
                  href={studyHref(p.id)}
                  onClick={studyLinkClick(p.id, studyHref(p.id))}
                  aria-label={`Read the ${p.title} case study`}
                  data-vt={p.id}
                  className={mediaFrame}
                >
                  <BrowserBar label={`Case study · ${p.title}`} />
                  <ProjectMedia project={p} mode="card" />
                </a>
              )}
              </div>
            </div>
          </div>
          </Tilt>
          </Reveal>
        </article>
      ))}
    </div>
  </div>
);

export default Projects;
