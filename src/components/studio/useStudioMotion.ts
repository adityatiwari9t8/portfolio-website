import { useEffect, type RefObject } from 'react';

const unit = (value: number) => Math.min(1, Math.max(0, value));

function setProgress(element: HTMLElement, property: string, value: number) {
  const rounded = value.toFixed(3);
  if (element.style.getPropertyValue(property) !== rounded) element.style.setProperty(property, rounded);
}

// Layout offsets stay fixed while perspective changes the visible position of the element.
function layoutTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

function trackSectionMotion(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>('[data-hero-depth]');
  const timeline = root.querySelector<HTMLElement>('[data-timeline]');
  const entrances = [...root.querySelectorAll<HTMLElement>('[data-scroll-reveal]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const settle = (element: HTMLElement) => {
    element.removeAttribute('data-reveal-active');
    element.style.removeProperty('--reveal-distance');
  };

  const update = () => {
    frame = 0;
    const height = window.innerHeight;
    const scroll = Math.max(0, window.scrollY);
    const revealStart = height * .50;
    const revealSpan = Math.max(1, height * .42);
    const heroHeight = hero?.getBoundingClientRect().height;
    const timelineBounds = timeline?.getBoundingClientRect();
    const positions = entrances.map(element => [element, layoutTop(element) - scroll] as const);

    for (const [element, top] of positions) {
      const active = element.hasAttribute('data-reveal-active');
      const distance = unit((top - revealStart) / revealSpan);
      if (!distance || reducedMotion.matches || element.contains(document.activeElement)) {
        if (active) settle(element);
        continue;
      }

      // The same viewport position produces the same pose in either scroll direction.
      if (!active) element.setAttribute('data-reveal-active', '');
      setProgress(element, '--reveal-distance', distance * distance * (3 - 2 * distance));
    }
    if (hero && heroHeight) setProgress(hero, '--hero-depth', unit(scroll / (heroHeight * .82)));
    if (timeline && timelineBounds) {
      setProgress(timeline, '--timeline-progress', unit((height * .76 - timelineBounds.top) / Math.max(1, timelineBounds.height)));
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const revealFocusedContent = (event: FocusEvent) => {
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-reveal-active]') : null;
    if (element) settle(element);
  };

  update();
  root.addEventListener('focusin', revealFocusedContent);
  reducedMotion.addEventListener('change', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  return () => {
    root.removeEventListener('focusin', revealFocusedContent);
    reducedMotion.removeEventListener('change', schedule);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(frame);
    for (const element of entrances) settle(element);
    timeline?.style.removeProperty('--timeline-progress');
    hero?.style.removeProperty('--hero-depth');
  };
}

export function useStudioMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanUpScroll = trackSectionMotion(root);
    let pointerFrame = 0;
    let pointerSurface: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const resetPointer = () => {
      pointerSurface?.style.removeProperty('--pointer-x');
      pointerSurface?.style.removeProperty('--pointer-y');
      pointerSurface = null;
    };

    const updatePointer = () => {
      pointerFrame = 0;
      if (!pointerSurface) return;
      const bounds = pointerSurface.getBoundingClientRect();
      const x = 2 * (pointerX - bounds.left) / bounds.width - 1;
      const y = 2 * (pointerY - bounds.top) / bounds.height - 1;
      pointerSurface.style.setProperty('--pointer-x', Math.min(1, Math.max(-1, x)).toFixed(3));
      pointerSurface.style.setProperty('--pointer-y', Math.min(1, Math.max(-1, y)).toFixed(3));
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
      const surface = event.target.closest<HTMLElement>('[data-pointer-tilt]');
      if (surface !== pointerSurface) {
        resetPointer();
        pointerSurface = surface;
      }
      if (!surface) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
    };

    const exitPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !pointerSurface) return;
      if (!(event.relatedTarget instanceof Node) || !pointerSurface.contains(event.relatedTarget)) resetPointer();
    };

    root.addEventListener('pointermove', movePointer);
    root.addEventListener('pointerout', exitPointer);

    return () => {
      cleanUpScroll();
      cancelAnimationFrame(pointerFrame);
      root.removeEventListener('pointermove', movePointer);
      root.removeEventListener('pointerout', exitPointer);
      resetPointer();
    };
  }, [rootRef]);
}
