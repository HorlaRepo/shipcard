import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { faq } from '../content/site.js';
import Faq from './Faq.jsx';

const [first, second] = /** @type {[typeof faq.items[0], typeof faq.items[0]]} */ (faq.items);

function renderFaq() {
  render(<Faq content={faq} />);
  return {
    user: userEvent.setup(),
    question: screen.getByRole('button', { name: first.question }),
  };
}

test('every answer starts closed and each question controls its own answer', () => {
  renderFaq();

  for (const item of faq.items) {
    const question = screen.getByRole('button', { name: item.question });
    const panel = document.getElementById(String(question.getAttribute('aria-controls')));

    expect(question).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveTextContent(item.answer);
    expect(panel).not.toBeVisible();
  }
});

test.each(['{Enter}', ' '])('pressing "%s" on a question opens its answer', async (key) => {
  const { user, question } = renderFaq();

  question.focus();
  await user.keyboard(key);

  expect(question).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(first.answer)).toBeVisible();
});

test('pressing the question again closes the answer, and focus stays on the question', async () => {
  const { user, question } = renderFaq();
  question.focus();

  await user.keyboard('{Enter}');
  await user.keyboard('{Enter}');

  expect(question).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(first.answer)).not.toBeVisible();
  expect(question).toHaveFocus();
});

test('opening one answer leaves the others as they were', async () => {
  const { user, question } = renderFaq();

  await user.click(question);
  await user.click(screen.getByRole('button', { name: second.question }));

  expect(screen.getByText(first.answer)).toBeVisible();
  expect(screen.getByText(second.answer)).toBeVisible();
});

test('questions are headings, so the list can be navigated by heading', () => {
  renderFaq();

  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(faq.items.length);
});
