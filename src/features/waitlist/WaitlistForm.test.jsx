import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, test } from 'vitest';

import { server } from '../../../tests/msw/server.js';
import { waitlist } from '../../content/site.js';
import { fillTemplate } from '../../lib/format.js';
import WaitlistForm from './WaitlistForm.jsx';

const content = waitlist.form;
const ENDPOINT = '/api/waitlist';

/** Registers a handler that accepts sign-ups and records what was sent. */
function acceptSignUps() {
  /** @type {unknown[]} */
  const received = [];
  server.use(
    http.post(ENDPOINT, async ({ request }) => {
      received.push(await request.json());
      return HttpResponse.json({ ok: true }, { status: 201 });
    }),
  );
  return received;
}

function renderForm() {
  const user = userEvent.setup();
  render(<WaitlistForm content={content} />);
  return {
    user,
    input: screen.getByRole('textbox', { name: content.label }),
    submitButton: screen.getByRole('button', { name: content.submit }),
  };
}

describe('validation', () => {
  test('submitting an empty form names the problem and moves focus to the field', async () => {
    const received = acceptSignUps();
    const { user, input, submitButton } = renderForm();

    await user.click(submitButton);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(content.problems.empty);
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain(alert.id);
    expect(received).toHaveLength(0);
  });

  test('leaving the field with a malformed address shows the problem', async () => {
    const { user, input } = renderForm();

    await user.type(input, 'ada@example');
    await user.tab();

    expect(screen.getByRole('alert')).toHaveTextContent(content.problems.invalid);
  });

  test('leaving an untouched field shows nothing', async () => {
    const { user, input } = renderForm();

    await user.click(input);
    await user.tab();

    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  test('the problem clears as soon as the visitor edits the address', async () => {
    const { user, input, submitButton } = renderForm();
    await user.click(submitButton);

    await user.type(input, 'a');

    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});

describe('submission', () => {
  test('a valid address is sent, and success is announced with the address', async () => {
    const received = acceptSignUps();
    const { user, input } = renderForm();

    await user.type(input, '  ada@example.com {Enter}');

    expect(await screen.findByRole('status')).toHaveTextContent(
      fillTemplate(content.success, { email: 'ada@example.com' }),
    );
    expect(received).toEqual([{ email: 'ada@example.com', website: '' }]);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('the button says what is happening while the request is in flight', async () => {
    server.use(
      http.post(ENDPOINT, async () => {
        await delay('infinite');
        return HttpResponse.json({});
      }),
    );
    const { user, input } = renderForm();

    await user.type(input, 'ada@example.com{Enter}');

    expect(await screen.findByRole('button', { name: content.submitting })).toBeVisible();
  });

  test.each([
    ['the server refuses the address', () => HttpResponse.json({}, { status: 400 }), 'rejected'],
    ['the server fails', () => HttpResponse.json({}, { status: 500 }), 'server'],
    ['the network fails', () => HttpResponse.error(), 'network'],
  ])('when %s, the problem is announced and the address is kept', async (_case, respond, kind) => {
    server.use(http.post(ENDPOINT, respond));
    const { user, input } = renderForm();

    await user.type(input, 'ada@example.com{Enter}');

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        content.problems[/** @type {keyof typeof content.problems} */ (kind)],
      ),
    );
    expect(input).toHaveValue('ada@example.com');
    expect(input).toHaveFocus();
  });

  test('a failed sign-up can be retried', async () => {
    server.use(http.post(ENDPOINT, () => HttpResponse.json({}, { status: 500 })));
    const { user, input } = renderForm();
    await user.type(input, 'ada@example.com{Enter}');
    await waitFor(() => expect(screen.getByRole('alert')).not.toBeEmptyDOMElement());

    acceptSignUps();
    await user.click(screen.getByRole('button', { name: content.submit }));

    expect(await screen.findByRole('status')).toBeVisible();
  });
});

test('the honeypot is hidden from assistive technology and out of the tab order', () => {
  renderForm();

  const honeypot = screen.getByLabelText(content.honeypotLabel);

  expect(honeypot).toHaveAttribute('tabindex', '-1');
  expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
});
