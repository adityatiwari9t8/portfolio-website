import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink, Github, Lightbulb, Minus, X } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { CASE_CTA } from '../data/content';
import { studyHref } from '../lib/route';
import { useDialog } from '../lib/useDialog';
import ProjectMedia from './ProjectMedia';
import BrowserBar from './BrowserBar';
import CountUp from './CountUp';
import { CASE_MEDIA } from '../lib/transition';

interface CaseStudyProps {
  project: Project | null;
  onClose: () => void;
  onOpenDemo: (p: Project) => void;
  onOpenContact: () => void;
}

const label = 'text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400';
const primary =
  'inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200';
const secondary =
  'inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 ring-1 ring-black/10 transition hover:bg-neutral-100 dark:bg-white/10 dark:text-neutral-100 dark:ring-white/10 dark:hover:bg-white/20';

/** Full-page write-up for one project: problem, what was built, what was learned. */
const CaseStudy: React.FC<CaseStudyProps> = ({ project, onClose, onOpenDemo, onOpenContact }) => {
  const root = useRef<HTMLDivElement | null>(null);
  const open = !!project;
  useDialog(open, onClose, root);

  // Jump back to the top when moving between projects; keep the tab title meaningful.
  useEffect(() => {
    if (!project) return;
    root.current?.scrollTo({ top: 0 });
    const before = document.title;
    document.title = `${project.title} | Case study`;
    return () => {
      document.title = before;
    };
  }, [project]);

  if (!project) return null;

  const i = PROJECTS.findIndex((p) => p.id === project.id);
  const next = PROJECTS.length > 1 ? PROJECTS[(i + 1) % PROJECTS.length] : null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      tabIndex={-1}
      className="custom-scrollbar fixed inset-0 z-[90] overflow-y-auto bg-[#f4f4f2] text-neutral-950 outline-none dark:bg-[#0b0b0c] dark:text-neutral-100"
    >
      <div className="sticky top-0 z-10 border-b border-black/5 bg-[#f4f4f2]/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0c]/85">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <button
            data-autofocus
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/60 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to work
          </button>
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/70 text-neutral-600 transition hover:bg-neutral-300 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-600 ring-1 ring-black/5 dark:bg-white/10 dark:text-neutral-300 dark:ring-white/10">
            {project.category}
          </span>
          {project.sample && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              Sample project
            </span>
          )}
          {project.year && <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{project.year}</span>}
        </div>

        <h1 id="case-title" className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
          {project.description}
        </p>
        {project.tryIt && (
          <p className="mt-3 max-w-2xl text-[15px] font-medium text-neutral-800 dark:text-neutral-200">
            <span className="mr-2 rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-neutral-950">
              Try it
            </span>
            {project.tryIt}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          {project.demo && (
            <button onClick={() => onOpenDemo(project)} className={primary}>
              Open live demo <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={project.demo ? secondary : primary}>
              <ExternalLink className="h-4 w-4" /> Live site
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className={secondary}>
              <Github className="h-4 w-4" /> Source code
            </a>
          )}
        </div>

        {/* preview */}
        <div className={`mt-10 overflow-hidden rounded-[1.75rem] border border-black/5 bg-gradient-to-br p-4 sm:p-8 dark:border-white/10 ${project.gradient}`}>
          <div
            style={{ viewTransitionName: CASE_MEDIA } as React.CSSProperties}
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] dark:border-white/10 dark:bg-neutral-900"
          >
            <BrowserBar label={`${project.demo ? "Live demo" : "Preview"} · ${project.title}`} />
            <ProjectMedia key={project.id} project={project} mode="study" lazy={false} />
          </div>
        </div>

        {project.sample && (
          <p className="mt-4 rounded-2xl bg-amber-50 px-5 py-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            This is a concept I built to show what I can do. It is not a client project and any business details in it are made up.
          </p>
        )}

        <dl className="mt-10 grid grid-cols-2 gap-4">
          {project.highlights.map((h) => (
            <div key={h.value} className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
              <dt className="text-lg font-semibold tracking-[-0.01em]"><CountUp text={h.value} /></dt>
              <dd className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{h.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12 md:grid-cols-[200px_1fr] md:gap-10">
          <p className={label}>The problem</p>
          <p className="text-lg leading-relaxed sm:text-xl">{project.study.problem}</p>

          <p className={label}>What I built</p>
          <ul className="space-y-3">
            {project.study.built.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {b}
              </li>
            ))}
          </ul>

          <p className={label}>What I learned</p>
          <p className="text-[15px] leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300">{project.study.learned}</p>

          <p className={label}>Limits</p>
          <ul className="space-y-3">
            {project.study.limits.map((l) => (
              <li key={l} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300">
                <Minus className="mt-1 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                {l}
              </li>
            ))}
          </ul>

          <p className={label}>Where it could go next</p>
          <div>
            <ul className="space-y-3">
              {project.study.ideas.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300">
                  <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">Ideas, not commitments.</p>
          </div>

          <p className={label}>Built with</p>
          <ul className="flex flex-wrap gap-2">
            {project.study.stack.map((t) => (
              <li key={t} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-700 ring-1 ring-black/5 dark:bg-white/10 dark:text-neutral-200 dark:ring-white/10">
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* closing */}
        <div className="mt-16 rounded-[1.75rem] border border-black/5 bg-white p-7 text-neutral-950 sm:p-10 dark:border-white/10 dark:bg-neutral-900 dark:text-white">
          <h2 className="text-2xl font-medium tracking-[-0.02em] sm:text-3xl">{CASE_CTA.title}</h2>
          <p className="mt-2 max-w-xl text-[15px] text-neutral-600 dark:text-neutral-400">{CASE_CTA.body}</p>
          <button
            onClick={() => {
              onOpenContact();
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {next && next.id !== project.id && (
          <a
            href={studyHref(next.id)}
            className="group mt-6 flex items-center justify-between rounded-[1.75rem] border border-black/5 bg-white p-6 transition hover:bg-neutral-50 sm:p-8 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800/70"
          >
            <span>
              <span className={label}>Next project</span>
              <span className="mt-2 block text-xl font-medium tracking-[-0.02em] sm:text-2xl">{next.title}</span>
            </span>
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </a>
        )}
      </article>
    </div>
  );
};

export default CaseStudy;
