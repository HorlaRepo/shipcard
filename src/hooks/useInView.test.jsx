import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';

import { useInView } from './useInView.js';

/** A stand-in for IntersectionObserver that the test triggers by hand. */
class FakeIntersectionObserver {
  /** @type {FakeIntersectionObserver[]} */
  static instances = [];

  /** @param {(entries: { isIntersecting: boolean }[]) => void} callback */
  constructor(callback) {
    this.callback = callback;
    this.isConnected = false;
    FakeIntersectionObserver.instances.push(this);
  }

  observe() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }

  /** @param {boolean} isIntersecting */
  report(isIntersecting) {
    if (this.isConnected) {
      act(() => this.callback([{ isIntersecting }]));
    }
  }
}

afterEach(() => {
  FakeIntersectionObserver.instances = [];
  vi.unstubAllGlobals();
});

/** @param {{ once?: boolean }} props */
function Probe({ once }) {
  const ref = useRef(/** @type {HTMLParagraphElement | null} */ (null));
  const isInView = useInView(ref, { once });
  return <p ref={ref}>{isInView ? 'in view' : 'out of view'}</p>;
}

function renderProbe(once = false) {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  render(<Probe once={once} />);
  return /** @type {FakeIntersectionObserver} */ (FakeIntersectionObserver.instances[0]);
}

test('reports in view where IntersectionObserver is missing, so nothing stays hidden', () => {
  render(<Probe />);

  expect(screen.getByText('in view')).toBeVisible();
});

test('starts out of view and follows the observer in both directions', () => {
  const observer = renderProbe();
  expect(screen.getByText('out of view')).toBeVisible();

  observer.report(true);
  expect(screen.getByText('in view')).toBeVisible();

  observer.report(false);
  expect(screen.getByText('out of view')).toBeVisible();
});

test('with once, stays in view after the first time and stops observing', () => {
  const observer = renderProbe(true);

  observer.report(true);
  observer.report(false);

  expect(screen.getByText('in view')).toBeVisible();
  expect(observer.isConnected).toBe(false);
});
