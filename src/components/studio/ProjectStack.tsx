import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { createCalendarLeaf } from './calendarTurn';
import type { Project } from '../../data/projects';

type Props = {
  projects: Project[];
  dark: boolean;
  onRead: (project: Project) => void;
  onDemo: (project: Project) => void;
  onList: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function ProjectStack({ projects, dark, onRead, onDemo, onList }: Props) {
  const stopNavigation = useRef<(() => void) | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const turningLayer = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const count = projects.length;

  useLayoutEffect(() => {
    const section = track.current!;
    const sticky = pin.current!;
    let frame = 0;
    let visible = true;
    let inset = 0;
    let travel = 1;

    const layer = turningLayer.current!;
    let leafHeight = 0;
    let printedIndex = -1;
    let turnLeaf: ReturnType<typeof createCalendarLeaf> | undefined;

    function paint() {
      frame = 0;
      const progress = clamp((inset - section.getBoundingClientRect().top) / travel, 0, 1) * (count - 1);
      const first = Math.floor(progress);
      const fraction = progress - first;
      // Leave a short resting interval so actions are usable between turns.
      const moving = clamp((fraction - .07) / .86, 0, 1);
      const turn = moving * moving * (3 - 2 * moving);
      const flying = turn > 0.0001 && turn < 0.9999;
      setActive(Math.round(progress));

      cards.current.forEach((card, index) => {
        if (!card) return;
        const slot = (index - first + count) % count;
        const depth = slot === 0 ? (count - 1) * turn : slot - turn;
        card.style.transform = `perspective(4200px) translateY(${-5 * depth}px) translateZ(${-22 * depth}px)`;
        card.style.zIndex = String(slot === 0 && turn > .5 ? 1 : count + 1 - slot);
        card.style.opacity = index === first && flying ? '0' : '1';
        card.style.visibility = index === first && flying ? 'hidden' : 'visible';
      });

      layer.hidden = !flying;
      if (!flying && printedIndex !== -1) {
        layer.replaceChildren();
        printedIndex = -1;
        turnLeaf = undefined;
      }
      if (flying) {
        if (first !== printedIndex) {
          const face = cards.current[first]?.querySelector<HTMLElement>('.calendar-face');
          if (!face) return;
          turnLeaf = createCalendarLeaf(layer, face, leafHeight);
          printedIndex = first;
        }
        // Switch draw order while the leaf is overhead. It then descends
        // behind the other sheets rather than covering the new front.
        layer.style.zIndex = String(turn <= .5 ? count + 2 : 0);
        turnLeaf?.(turn, count - 1);
      }
    }
    function schedule() {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    }
    function measure() {
      leafHeight = layer.parentElement!.offsetHeight;
      printedIndex = -1;
      inset = parseFloat(getComputedStyle(sticky).top);
      travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      cancelAnimationFrame(frame);
      paint();
    }
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    resize.observe(sticky);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    visibility.observe(section);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      stopNavigation.current?.();
      window.removeEventListener('scroll', schedule);
      resize.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(frame);
      layer.replaceChildren();
    };
  }, [count, dark]);

  function visit(index: number) {
    if (!track.current || !pin.current || count < 2) return;
    const top = window.scrollY + track.current.getBoundingClientRect().top - parseFloat(getComputedStyle(pin.current).top);
    const travel = track.current.offsetHeight - pin.current.offsetHeight;
    stopNavigation.current?.();
    const start = window.scrollY;
    const distance = top + travel * index / (count - 1) - start;
    const duration = 1600;
    const started = performance.now();
    const events = new AbortController();
    let frame = 0;
    function stop() {
      cancelAnimationFrame(frame);
      events.abort();
      stopNavigation.current = null;
    }
    function advance(now: number) {
      const elapsed = clamp((now - started) / duration, 0, 1);
      // The fold already eases at both ends. Move along its scroll track evenly.
      window.scrollTo({ top: start + distance * elapsed, behavior: 'instant' });
      if (elapsed < 1) frame = requestAnimationFrame(advance);
      else stop();
    }
    stopNavigation.current = stop;
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'resize']) {
      window.addEventListener(event, stop, { passive: true, signal: events.signal });
    }
    frame = requestAnimationFrame(advance);
  }

  return (
    <div className="deck-track" ref={track} style={{ '--steps': count - 1 } as CSSProperties}>
      <div className="deck-pin" ref={pin}>
        <div className="deck-stage">
          {projects.map((project, index) => (
            <article className="deck-card" key={project.id} style={{ zIndex: count - index }}
              ref={el => { cards.current[index] = el; }} inert={index !== active} aria-hidden={index !== active}>
              <div className="calendar-face">
                <div className="deck-story">
                  <p className="deck-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="deck-summary">{project.summary ?? project.description}</p>
                  <div className="deck-actions">
                    <button onClick={() => onRead(project)}>Case study <ArrowRight /></button>
                    {project.demo && <button onClick={() => onDemo(project)}>Try demo <ArrowUpRight /></button>}
                    {!project.demo && project.repo && <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`Source code for ${project.title}`}>Source code <ArrowUpRight aria-hidden="true" /></a>}
                  </div>
                </div>
                <button className="deck-preview" aria-label={`Explore ${project.title}`} onClick={() => onRead(project)}>
                  <img src={dark ? project.imageDark : project.imageLight} alt="" width={project.imageWidth} height={project.imageHeight} loading="lazy" />
                </button>
              </div>
            </article>
          ))}
          <div className="calendar-turn" ref={turningLayer} inert aria-hidden="true" hidden />
        </div>
        <div className="deck-controls">
          <span aria-live="off">{active + 1} of {count}</span>
          <div>
            <button onClick={onList}>All projects</button>
            <button className="deck-arrow" aria-label="Previous project" disabled={active === 0} onClick={() => visit(active - 1)}><ArrowLeft /></button>
            <button className="deck-arrow" aria-label="Next project" disabled={active === count - 1} onClick={() => visit(active + 1)}><ArrowRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
