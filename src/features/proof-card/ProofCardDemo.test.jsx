import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  githubFailure,
  githubHanging,
  githubRateLimited,
  githubSuccess,
  githubUnreachable,
  RESET_EPOCH_SECONDS,
} from '../../../tests/msw/github.js';
import { server } from '../../../tests/msw/server.js';
import { proofCard as content } from '../../content/site.js';
import { fillTemplate, formatClockTime } from '../../lib/format.js';
import ProofCardDemo from './ProofCardDemo.jsx';
import ProofCardErrorBoundary from './ProofCardErrorBoundary.jsx';

const MS_PER_SECOND = 1000;

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

function renderDemo() {
  const user = userEvent.setup();
  render(<ProofCardDemo content={content} />);
  return {
    user,
    input: screen.getByRole('textbox', { name: content.form.label }),
    submitButton: screen.getByRole('button', { name: content.form.submit }),
    /** The live region every result is announced through. */
    result: /** @type {HTMLElement} */ (document.querySelector('[aria-live="polite"]')),
  };
}

/** @param {string} template @param {Record<string, string | number>} [values] */
const text = (template, values = {}) => fillTemplate(template, values);

describe('a successful lookup', () => {
  test('submitting a username renders the card in the live region', async () => {
    server.use(...githubSuccess().handlers);
    const { user, input, result } = renderDemo();
    expect(within(result).getByText(content.empty.title)).toBeVisible();

    await user.type(input, 'torvalds{Enter}');

    const card = await within(result).findByRole('article', { name: 'Linus Torvalds' });
    expect(within(card).getByRole('link', { name: 'linux' })).toHaveAttribute(
      'href',
      'https://github.com/torvalds/linux',
    );
    expect(within(card).getByText('268K')).toBeVisible();
    expect(within(card).getByText(content.card.countingRule)).toBeVisible();
    expect(result).toHaveAttribute('aria-busy', 'false');
  });

  test('accepts a pasted profile link', async () => {
    const github = githubSuccess();
    server.use(...github.handlers);
    const { user, input, submitButton } = renderDemo();

    await user.type(input, 'https://github.com/torvalds');
    await user.click(submitButton);

    await screen.findByRole('article', { name: 'Linus Torvalds' });
    expect(github.requests[0]?.url).toContain('/users/torvalds');
  });

  test('an example chip looks that account up', async () => {
    server.use(...githubSuccess().handlers);
    const { user, input } = renderDemo();

    await user.click(screen.getByRole('button', { name: '@torvalds' }));

    expect(input).toHaveValue('torvalds');
    expect(await screen.findByRole('article', { name: 'Linus Torvalds' })).toBeVisible();
  });

  test('the region is busy and names what is loading while the request is in flight', async () => {
    server.use(...githubHanging());
    const { user, input, result } = renderDemo();

    await user.type(input, 'torvalds{Enter}');

    expect(result).toHaveAttribute('aria-busy', 'true');
    expect(
      within(result).getByText(text(content.loading, { username: 'torvalds' })),
    ).toBeInTheDocument();
  });

  test('puts the username in the address and offers to copy the link', async () => {
    server.use(...githubSuccess().handlers);
    const { user, input } = renderDemo();

    await user.type(input, 'torvalds{Enter}');
    await screen.findByRole('article');

    expect(window.location.search).toBe('?u=torvalds');
    await user.click(screen.getByRole('button', { name: content.actions.copyLink }));
    expect(await screen.findByRole('button', { name: content.actions.copied })).toBeVisible();
    // Announced as well as shown: the same words sit in a status region.
    expect(
      screen.getByText(content.actions.copied, { selector: '[role="status"]' }),
    ).toBeInTheDocument();
    expect(await navigator.clipboard.readText()).toBe(window.location.href);
  });

  test('says so when the link cannot be copied', async () => {
    server.use(...githubSuccess().handlers);
    const { user, input } = renderDemo();
    await user.type(input, 'torvalds{Enter}');
    await screen.findByRole('article');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));

    await user.click(screen.getByRole('button', { name: content.actions.copyLink }));

    expect(await screen.findByText(content.actions.copyFailedDetail)).toBeInTheDocument();
  });

  test('clearing returns to the empty card and removes the username from the address', async () => {
    server.use(...githubSuccess().handlers);
    const { user, input, result } = renderDemo();
    await user.type(input, 'torvalds{Enter}');
    await screen.findByRole('article');

    await user.click(screen.getByRole('button', { name: content.actions.clear }));

    expect(within(result).getByText(content.empty.title)).toBeVisible();
    expect(window.location.search).toBe('');
  });

  test('warns when few lookups are left this hour', async () => {
    server.use(...githubSuccess({ headers: { 'x-ratelimit-remaining': '6' } }).handlers);
    const { user, input } = renderDemo();

    await user.type(input, 'torvalds{Enter}');

    expect(await screen.findByText(text(content.form.quotaHint, { count: 3 }))).toBeVisible();
  });
});

describe('input validation', () => {
  test.each([
    ['nothing', '', content.form.problems.empty],
    ['an invalid username', 'not a username', content.form.problems.invalid],
  ])('%s shows an inline error and makes no request', async (_case, typed, message) => {
    const github = githubSuccess();
    server.use(...github.handlers);
    const { user, input, submitButton } = renderDemo();

    if (typed) {
      await user.type(input, typed);
    }
    await user.click(submitButton);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(message);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain(alert.id);
    expect(input).toHaveFocus();
    expect(github.requests).toHaveLength(0);
  });

  test('the error clears as soon as the visitor edits the input', async () => {
    const { user, input, submitButton } = renderDemo();
    await user.click(submitButton);

    await user.type(input, 't');

    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});

describe('a failed lookup', () => {
  test('not found is announced beside the input, and focus stays in it', async () => {
    server.use(...githubFailure(404));
    const { user, input, submitButton, result } = renderDemo();

    await user.type(input, 'nobody-here');
    await user.click(submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      text(content.form.problems.notFound, { username: 'nobody-here' }),
    );
    await waitFor(() => expect(input).toHaveFocus());
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(within(result).getByText(content.empty.title)).toBeVisible();
  });

  test('the hourly limit shows the local reset time and offers saved example cards', async () => {
    server.use(...githubRateLimited());
    const { user, input, result } = renderDemo();
    const resetTime = formatClockTime(new Date(RESET_EPOCH_SECONDS * MS_PER_SECOND));

    await user.type(input, 'torvalds{Enter}');

    expect(
      await within(result).findByText(text(content.errors.rateLimit, { time: resetTime })),
    ).toBeVisible();
    const examples = within(result).getByRole('list', { name: content.errors.examplesLabel });
    expect(within(examples).getAllByRole('button')).toHaveLength(3);
    expect(within(result).queryByRole('button', { name: content.errors.retry })).toBeNull();
  });

  test('a saved example opens as a card labelled with its snapshot date, with no request', async () => {
    server.use(...githubRateLimited());
    const { user, input, result } = renderDemo();
    await user.type(input, 'octocat{Enter}');
    const examples = await within(result).findByRole('list', {
      name: content.errors.examplesLabel,
    });
    // From here on any request would fail the test: no handlers are registered.
    server.resetHandlers();

    await user.click(within(examples).getByRole('button', { name: '@torvalds' }));

    const card = await within(result).findByRole('article', { name: 'Linus Torvalds' });
    expect(card).toBeVisible();
    expect(within(result).getByText(/^Snapshot from \d{1,2} \w{3} \d{4}$/)).toBeVisible();
    // A snapshot is not a live card, so it gets no shareable address.
    expect(window.location.search).toBe('');
    expect(screen.queryByRole('button', { name: content.actions.copyLink })).toBeNull();
  });

  test('a secondary limit gives no time', async () => {
    server.use(...githubFailure(429, { 'x-ratelimit-remaining': '12' }));
    const { user, input, result } = renderDemo();

    await user.type(input, 'torvalds{Enter}');

    expect(await within(result).findByText(content.errors.rateLimitUnknown)).toBeVisible();
  });

  test.each([
    ['a server error', () => githubFailure(500), content.errors.upstream],
    ['an unreachable network', () => githubUnreachable(), content.errors.network],
  ])('%s is announced with a retry that works', async (_case, createHandlers, message) => {
    server.use(...createHandlers());
    const { user, input, result } = renderDemo();
    await user.type(input, 'torvalds{Enter}');
    expect(await within(result).findByText(message)).toBeVisible();

    server.use(...githubSuccess().handlers);
    await user.click(within(result).getByRole('button', { name: content.errors.retry }));

    expect(await within(result).findByRole('article', { name: 'Linus Torvalds' })).toBeVisible();
  });

  test('being offline is said plainly', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    server.use(...githubUnreachable());
    const { user, input, result } = renderDemo();

    await user.type(input, 'torvalds{Enter}');

    expect(await within(result).findByText(content.errors.offline)).toBeVisible();
  });
});

describe('the ?u= deep link', () => {
  test('loads that card on arrival and fills the input', async () => {
    window.history.replaceState(null, '', '/?u=torvalds');
    const github = githubSuccess();
    server.use(...github.handlers);

    const { input } = renderDemo();

    expect(input).toHaveValue('torvalds');
    expect(await screen.findByRole('article', { name: 'Linus Torvalds' })).toBeVisible();
    expect(github.requests).toHaveLength(2);
  });

  test('an invalid username in the address is ignored', () => {
    window.history.replaceState(null, '', '/?u=../../etc');

    const { input, result } = renderDemo();

    expect(input).toHaveValue('');
    expect(within(result).getByText(content.empty.title)).toBeVisible();
  });
});

test('a rendering error inside the card shows the fallback instead of blanking the page', () => {
  // React logs the caught error; that noise is expected here.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const Broken = () => {
    throw new Error('render failed');
  };

  render(
    <>
      <p>The rest of the page</p>
      <ProofCardErrorBoundary fallback={<p>{content.errors.render}</p>}>
        <Broken />
      </ProofCardErrorBoundary>
    </>,
  );

  expect(screen.getByText(content.errors.render)).toBeVisible();
  expect(screen.getByText('The rest of the page')).toBeVisible();
});
