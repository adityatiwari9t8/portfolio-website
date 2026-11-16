import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';
import './project-showcase.css';

type Props = {
  projects: Project[];
  dark: boolean;
  onRead: (project: Project) => void;
  onDemo: (project: Project) => void;
};

export default function ProjectStack({ projects, dark, onRead, onDemo }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const count = projects.length;
  const active = Math.min(activeIndex, count - 1);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    if (!track || !panel || count < 2) return;

    let frame = 0;
    let stepLength = 1;
    let inset = 0;
    let progress = 0;
    let lastActive = -1;
    let previousTime = 0;

    const update = (time: number, snap = false) => {
      frame = 0;
      const bounds = track.getBoundingClientRect();
      const step = Math.min(count - 1, Math.max(0, (inset - bounds.top) / stepLength));
      const project = Math.floor(step);
      // Leave a short reading interval on either side of each turn.
      const turn = Math.min(1, Math.max(0, (step - project - .19) / .71));
      const target = project + turn ** 3 * (10 - 15 * turn + 6 * turn ** 2);
      const elapsed = previousTime ? Math.min(50, time - previousTime) : 16;
      const remaining = target - progress;
      const offscreen = bounds.bottom <= inset || bounds.top >= window.innerHeight;
      const nextProgress = snap || offscreen || Math.abs(remaining) > 1.25 || Math.abs(remaining) < .002
        ? target
        : progress + remaining * (1 - Math.exp(-elapsed / 36));

      if (nextProgress !== progress) {
        progress = nextProgress;
        panel.style.setProperty('--showcase-progress', progress.toFixed(4));
      }

      const nextActive = Math.round(Number(progress.toFixed(4)));
      if (nextActive !== lastActive) {
        if (lastActive >= 0 && panel.contains(document.activeElement) && document.activeElement !== panel) {
          panel.focus({ preventScroll: true });
        }
        lastActive = nextActive;
        setActiveIndex(nextActive);
      }

      previousTime = progress === target ? 0 : time;
      if (previousTime) schedule();
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(time => update(time));
    };

    const measure = () => {
      const panelHeight = panel.getBoundingClientRect().height;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      // Short viewports can scroll the top of the panel away while leaving its actions accessible.
      inset = Math.min(headerHeight + 12, window.innerHeight - panelHeight - 12);
      stepLength = Math.max(1, (track.getBoundingClientRect().height - panelHeight) / count);
      panel.style.top = `${inset}px`;
      window.cancelAnimationFrame(frame);
      update(performance.now(), true);
    };

    const resize = new ResizeObserver(measure);
    resize.observe(track);
    resize.observe(panel);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      resize.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [count]);

  if (!count) return null;

  return (
    <div className="project-showcase" ref={trackRef}
      style={{ '--showcase-steps': count > 1 ? count : 0 } as CSSProperties}>
      <div className="showcase-pin" ref={panelRef} tabIndex={-1} role="region" aria-label="Project showcase">
        <div className="showcase-scene">
          <div className="showcase-planes">
            {projects.map((project, index) => (
              <button key={project.id} type="button" className="showcase-plane"
                style={{ '--project-index': index } as CSSProperties}
                disabled={index !== active} aria-hidden={index !== active}
                aria-label={`Read case study for ${project.title}`}
                onClick={() => onRead(project)}>
                <span className="showcase-screen">
                  <img src={dark ? project.imageDark : project.imageLight} alt="" width={project.imageWidth}
                    height={project.imageHeight} loading="lazy" draggable={false} />
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="mono showcase-count" role="status">
          <span aria-hidden="true">{active + 1} / {count}</span>
          <span className="sr-only">Project {active + 1} of {count}. {projects[active].title}</span>
        </p>
        <div className="showcase-info">
          {projects.map((project, index) => (
            <article className="showcase-detail" key={project.id} inert={index !== active} aria-hidden={index !== active}>
              <div className="showcase-story">
                <p className="mono showcase-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p className="showcase-summary">{project.summary ?? project.description}</p>
              </div>
              <div className="showcase-actions">
                <button type="button" className="showcase-read" onClick={() => onRead(project)}>Case study <ArrowRight aria-hidden="true" /></button>
                {project.demo && <button type="button" onClick={() => onDemo(project)}>Try demo <ArrowUpRight aria-hidden="true" /></button>}
                {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Source code <ArrowUpRight aria-hidden="true" /></a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
