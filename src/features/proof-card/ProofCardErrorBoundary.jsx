import { Component } from 'react';

import { logInDevelopment } from '../../lib/devLog.js';

/**
 * Catches a rendering error inside the card and shows a fallback in its
 * place, so a bug in the demo cannot blank the rest of the page.
 *
 * A class because React offers no hook for catching render errors.
 *
 * @extends {Component<{ fallback: import('react').ReactNode, children: import('react').ReactNode }, { hasError: boolean }>}
 */
export default class ProofCardErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /** @param {unknown} error */
  componentDidCatch(error) {
    logInDevelopment('The proof card failed to render', error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
