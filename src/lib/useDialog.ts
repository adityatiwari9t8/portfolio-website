import { RefObject, useEffect, useRef } from 'react';

/**
 * Shared behaviour for every full-screen overlay (contact form, demos, case studies):
 * Esc closes only the top-most one, Tab stays inside it, page scroll is locked,
 * and focus returns to whatever opened it.
 */
const stack: symbol[] = [];
let lockCount = 0;
let previousOverflow = '';
const inertLocks = new Map<HTMLElement, { count: number; previous: boolean }>();
const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export function useDialog(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const id = Symbol('dialog');
    stack.push(id);
    const previous = document.activeElement as HTMLElement | null;
    if (lockCount++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    const node = ref.current;
    // Hide the background from pointer input and assistive technology, including nested dialogs.
    const locked: HTMLElement[] = [];
    for (let branch: HTMLElement | null = node; branch?.parentElement && branch !== document.body; branch = branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
        const lock = inertLocks.get(sibling) ?? { count: 0, previous: sibling.inert };
        lock.count++;
        inertLocks.set(sibling, lock);
        sibling.inert = true;
        locked.push(sibling);
      }
    }
    const focusTimer = window.setTimeout(() => {
      const target = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
      target?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
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
      for (const element of locked) {
        const lock = inertLocks.get(element);
        if (lock && --lock.count === 0) {
          element.inert = lock.previous;
          inertLocks.delete(element);
        }
      }
      if (--lockCount === 0) document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open, ref]);
}
