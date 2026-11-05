import { useRef, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';

/** The actual project surface tilts; touch, keyboard and reduced-motion stay still. */
export default function ProjectPreview({ project, dark, onOpen }: { project: Project; dark: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reset = () => {
    const style = ref.current?.style;
    style?.removeProperty('--tilt-x');
    style?.removeProperty('--tilt-y');
    style?.removeProperty('--lift');
  };
  const tilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.currentTarget;
    const box = target.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    target.style.setProperty('--tilt-x', `${-y * 4}deg`);
    target.style.setProperty('--tilt-y', `${x * 4}deg`);
    target.style.setProperty('--lift', '12px');
  };
  return <button ref={ref} className="project-preview" onClick={onOpen} onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset} aria-label={`Explore ${project.title}`}>
    <img src={dark ? project.imageDark : project.imageLight} alt="" loading="lazy" width={project.imageWidth} height={project.imageHeight} />
    <span aria-hidden="true"><ArrowUpRight size={18} /></span>
  </button>;
}
