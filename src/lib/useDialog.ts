import { RefObject, useEffect, useRef } from 'react';

/**
 * Shared behaviour for every full-screen overlay (contact form, demos, case studies):
 * Esc closes only the top-most one, Tab stays inside it, page scroll is locked,
 * and focus returns to whatever opened it.
 */
const stack: symbol[] = [];
let lockCount = 0;
const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export function useDialog(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const id = Symbol('dialog');
    stack.push(id);
    const previous = document.activeElement as HTMLElement | null;
    if (lockCount++ === 0) document.body.style.overflow = 'hidden';

    const node = ref.current;
    const focusTimer = window.setTimeout(() => {
      const target = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
      target?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const inside = node.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      if (--lockCount === 0) document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open, ref]);
}
