import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { site } from '../content/site.js';
import App from './App.jsx';

test('renders the product name as the page heading', () => {
  render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: site.name })).toBeInTheDocument();
});
