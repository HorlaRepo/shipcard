import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { setMediaQuery } from '../../../tests/helpers/matchMedia.js';
import { navigation } from '../../content/site.js';
import { MEDIA_FROM_MD } from '../../lib/breakpoints.js';
import MobileNav from './MobileNav.jsx';

function renderMobileNav() {
  render(
    <>
      <main>
        <a href="#outside">Outside the menu</a>
      </main>
      <MobileNav navigation={navigation} />
    </>,
  );
  return {
    user: userEvent.setup(),
    trigger: screen.getByRole('button', { name: navigation.menu.openLabel }),
  };
}

test('the menu is closed until its button is activated', () => {
  const { trigger } = renderMobileNav();

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test.each(['{Enter}', ' '])('pressing "%s" on the button opens the menu', async (key) => {
  const { user, trigger } = renderMobileNav();

  trigger.focus();
  await user.keyboard(key);

  expect(screen.getByRole('dialog', { name: navigation.menu.dialogLabel })).toBeVisible();
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('opening moves focus into the menu and makes the rest of the page inert', async () => {
  const { user, trigger } = renderMobileNav();

  await user.click(trigger);

  expect(screen.getByRole('button', { name: navigation.menu.closeLabel })).toHaveFocus();
  expect(screen.getByRole('main')).toHaveAttribute('inert');
});

test('Tab cycles inside the open menu in both directions', async () => {
  const { user, trigger } = renderMobileNav();
  await user.click(trigger);
  const closeButton = screen.getByRole('button', { name: navigation.menu.closeLabel });
  const lastLink = screen.getByRole('link', { name: navigation.cta.label });

  await user.tab({ shift: true });
  expect(lastLink).toHaveFocus();

  await user.tab();
  expect(closeButton).toHaveFocus();
});

test('Escape closes the menu, returns focus to the button and restores the page', async () => {
  const { user, trigger } = renderMobileNav();
  await user.click(trigger);

  await user.keyboard('{Escape}');

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('main')).not.toHaveAttribute('inert');
});

test('the close button closes the menu and returns focus to the button', async () => {
  const { user, trigger } = renderMobileNav();
  await user.click(trigger);

  await user.click(screen.getByRole('button', { name: navigation.menu.closeLabel }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('following a link closes the menu', async () => {
  const { user, trigger } = renderMobileNav();
  await user.click(trigger);
  const [firstLink] = navigation.links;

  await user.click(screen.getByRole('link', { name: firstLink?.label }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('the menu closes when the screen becomes wide enough for the inline links', async () => {
  const { user, trigger } = renderMobileNav();
  await user.click(trigger);

  act(() => setMediaQuery(MEDIA_FROM_MD, true));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('main')).not.toHaveAttribute('inert');
});
