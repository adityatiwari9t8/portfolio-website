import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Play, X } from 'lucide-react';
import { PROJECTS, Project } from '../data/projects';
import { CASE_CTA } from '../data/content';
import { studyHref } from '../lib/route';
import { useDialog } from '../lib/useDialog';
import ProjectMedia from './ProjectMedia';
import { CASE_MEDIA } from '../lib/transition';

interface CaseStudyProps {
  project: Project | null;
  onClose: () => void;
  onOpenDemo: (p: Project) => void;
  onOpenContact: () => void;
}

const StudySection: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="study-section grid gap-4 border-t border-black/10 py-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8 dark:border-white/10">
    <h2 className="text-base font-semibold tracking-tight">{title}</h2>
    <div className="min-w-0 text-[15px] leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300">{children}</div>
  </section>
);

const CaseStudy: React.FC<CaseStudyProps> = ({ project, onClose, onOpenDemo, onOpenContact }) => {
  const root = useRef<HTMLDivElement | null>(null);
  useDialog(!!project, onClose, root);
  useEffect(() => {
    if (!project) return;
    root.current?.scrollTo({ top: 0 });
    const before = document.title;
    document.title = `${project.title} | Case study`;
    return () => { document.title = before; };
  }, [project]);
  if (!project) return null;
  const index = PROJECTS.findIndex((p) => p.id === project.id);
  const next = PROJECTS.length > 1 ? PROJECTS[(index + 1) % PROJECTS.length] : null;
  const jump = (id: string) => {
    const section = root.current?.querySelector<HTMLElement>(`#${id}`);
    if (!section || !root.current) return;
    const top = section.getBoundingClientRect().top - root.current.getBoundingClientRect().top + root.current.scrollTop - 120;
    root.current.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const navigation = [
    { id: 'study-overview', label: 'Overview' },
    { id: 'study-built', label: 'Implementation' },
    ...(project.study.evidence?.length ? [{ id: 'study-evidence', label: 'Validation' }] : []),
    { id: 'study-learned', label: 'Lessons' }
  ];
  return (
    <div ref={root} role="dialog" aria-modal="true" aria-labelledby="case-title" tabIndex={-1}
      className="custom-scrollbar fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-[#f4f4f2] text-neutral-950 outline-none dark:bg-[#0b0b0c] dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-[#f4f4f2]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0b0c]/95">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <button data-autofocus onClick={onClose} className="text-link"><ArrowLeft size={17} aria-hidden /> Back to work</button>
          <button onClick={onClose} aria-label="Close case study" className="icon-button"><X size={20} aria-hidden /></button>
        </div>
        <nav aria-label="Case study sections" className="mx-auto flex max-w-4xl gap-5 overflow-x-auto px-4 sm:px-6">
          {navigation.map((item) => <button key={item.id} onClick={() => jump(item.id)} className="text-link shrink-0 text-xs">{item.label}</button>)}
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="eyebrow flex flex-wrap gap-3"><span>{project.category}</span>{project.year && <span>{project.year}</span>}{project.sample && <span>Concept project</span>}</div>
        <h1 id="case-title" className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-none tracking-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">{project.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.demo && <button onClick={() => onOpenDemo(project)} className="button-primary">Open live demo <Play size={15} aria-hidden /></button>}
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className={project.demo ? 'button-secondary' : 'button-primary'}>Live site <ArrowUpRight size={15} aria-hidden /></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="button-secondary">Source code <Github size={16} aria-hidden /></a>}
        </div>
        <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">{project.study.stack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <figure className="mt-8">
          <div style={{ viewTransitionName: CASE_MEDIA } as React.CSSProperties} className="surface overflow-hidden">
            <ProjectMedia key={project.id} project={project} mode="study" lazy={false} />
          </div>
          {project.tryIt && <figcaption className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"><span className="font-medium text-neutral-900 dark:text-neutral-100">Try it: </span>{project.tryIt}</figcaption>}
        </figure>
        {project.sample && <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">A concept built to explore an idea, not a client project. Business details are illustrative.</p>}
        <dl className="my-8 grid gap-5 sm:grid-cols-2">{project.highlights.map((highlight) => <div key={highlight.value} className="border-l-2 border-emerald-700 pl-4 dark:border-emerald-400">
          <dt className="text-base font-semibold">{highlight.value}</dt><dd className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{highlight.label}</dd>
        </div>)}</dl>

        <StudySection id="study-overview" title="The problem"><p>{project.study.problem}</p></StudySection>
        {!!project.study.flow?.length && <section className="border-t border-black/10 py-8 dark:border-white/10">
          <h2 className="text-base font-semibold tracking-tight">How it works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">{project.study.flow.map((step, i) => <li key={step.title} className="surface relative p-5">
            <span className="eyebrow text-emerald-800 dark:text-emerald-300">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.description}</p>
            {i < project.study.flow!.length - 1 && <ArrowRight size={15} aria-hidden className="absolute right-5 top-5 text-neutral-500" />}
          </li>)}</ol>
        </section>}
        <StudySection id="study-built" title="What I built"><ul className="list-disc space-y-4 pl-4 marker:text-emerald-700 dark:marker:text-emerald-400">{project.study.built.map((item) => <li key={item}>{item}</li>)}</ul></StudySection>
        {!!project.study.evidence?.length && <StudySection id="study-evidence" title="Validation"><dl className="space-y-5">{project.study.evidence.map((item) => <div key={item.label}>
          <dt className="font-semibold text-neutral-900 dark:text-white">{item.label}</dt>
          <dd className="mt-1">{item.detail}{item.href && <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-link mt-1">View evidence <ArrowUpRight size={14} aria-hidden /></a>}</dd>
        </div>)}</dl></StudySection>}
        <StudySection id="study-learned" title="What I learned"><p>{project.study.learned}</p></StudySection>
        <StudySection id="study-limits" title="Known limitations"><ul className="list-disc space-y-3 pl-4">{project.study.limits.map((item) => <li key={item}>{item}</li>)}</ul></StudySection>
        <StudySection id="study-next" title="What I’d explore next"><ul className="list-disc space-y-3 pl-4">{project.study.ideas.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Ideas for further exploration.</p></StudySection>
        <div className="surface mt-5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{CASE_CTA.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{CASE_CTA.body}</p>
          <button onClick={onOpenContact} className="button-primary mt-5">Get in touch <ArrowUpRight size={16} aria-hidden /></button>
        </div>
        {next && <a href={studyHref(next.id)} className="text-link mt-5 flex justify-between gap-5 border-b border-black/10 py-5 dark:border-white/10"><span><span className="eyebrow block">Next project</span><span className="mt-1 block text-base text-neutral-900 dark:text-neutral-100">{next.title}</span></span><ArrowRight size={20} className="shrink-0" aria-hidden /></a>}
      </article>
    </div>
  );
};
export default CaseStudy;
