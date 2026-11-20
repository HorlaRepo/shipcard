import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled])';
const SCROLL_LOCK_ATTRIBUTE = 'data-scroll-locked';

/**
 * Marks everything outside `element` as inert by walking up to <body> and
 * disabling each ancestor's other children. Returns a function that undoes it.
 *
 * @param {HTMLElement} element
 * @returns {() => void}
 */
function makeOutsideInert(element) {
  /** @type {Element[]} */
  const madeInert = [];

  for (
    let node = element;
    node.parentElement && node !== document.body;
    node = node.parentElement
  ) {
    for (const sibling of node.parentElement.children) {
      if (sibling !== node && !sibling.hasAttribute('inert')) {
        sibling.setAttribute('inert', '');
        madeInert.push(sibling);
      }
    }
  }

  return () => madeInert.forEach((sibling) => sibling.removeAttribute('inert'));
}

/**
 * Gives an element modal dialog behaviour while it is open: focus moves in,
 * Tab cycles inside it, Escape closes it, the rest of the page is inert and
 * the page behind does not scroll.
 *
 * Returning focus to the trigger is the caller's job, because only the caller
 * knows why the dialog closed (Escape returns focus; following a link must not).
 *
 * The native <dialog> element does all of this, but jsdom does not implement
 * showModal(), so its behaviour could not be covered by this project's tests
 * (decision log L-12).
 *
 * @param {object} options
 * @param {boolean} options.isOpen
 * @param {import('react').RefObject<HTMLElement | null>} options.dialogRef
 * @param {() => void} options.onEscape Called when the visitor presses Escape.
 */
export function useModalDialog({ isOpen, dialogRef, onEscape }) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) {
      return undefined;
    }

    const restoreOutside = makeOutsideInert(dialog);
    document.documentElement.setAttribute(SCROLL_LOCK_ATTRIBUTE, '');

    /** @returns {HTMLElement[]} */
    const getFocusable = () =>
      [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
        (element) => element instanceof HTMLElement,
      );
    getFocusable()[0]?.focus();

    /** @param {KeyboardEvent} event */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.documentElement.removeAttribute(SCROLL_LOCK_ATTRIBUTE);
      restoreOutside();
    };
  }, [isOpen, dialogRef, onEscape]);
}
