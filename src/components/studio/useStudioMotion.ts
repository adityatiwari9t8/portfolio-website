import { useEffect, type RefObject } from 'react';

function observeScrollReveals(root: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;

  const elements = [...root.querySelectorAll<HTMLElement>('[data-scroll-reveal]')];
  const viewport = window.innerHeight;
  const belowViewport = elements.filter(element =>
    element.getBoundingClientRect().top >= viewport && !element.contains(document.activeElement));
  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.setAttribute('data-reveal-state', 'visible');
      observer.unobserve(target);
    }
  }, { rootMargin: '0px 0px -8px' });

  for (const element of belowViewport) {
    element.setAttribute('data-reveal-state', 'pending');
    observer.observe(element);
  }

  const revealFocusedContent = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest('[data-reveal-state]');
    if (!element) return;
    observer.unobserve(element);
    element.removeAttribute('data-reveal-state');
  };
  root.addEventListener('focusin', revealFocusedContent);

  return () => {
    observer.disconnect();
    root.removeEventListener('focusin', revealFocusedContent);
    for (const element of belowViewport) element.removeAttribute('data-reveal-state');
  };
}

export function useStudioMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanUpReveals = observeScrollReveals(root);
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
      cleanUpReveals?.();
      cancelAnimationFrame(pointerFrame);
      root.removeEventListener('pointermove', movePointer);
      root.removeEventListener('pointerout', exitPointer);
      resetPointer();
    };
  }, [rootRef]);
}
