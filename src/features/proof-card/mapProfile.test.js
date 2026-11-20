import { describe, expect, test } from 'vitest';

import reposFixture from '../../../tests/fixtures/githubRepos.json';
import userFixture from '../../../tests/fixtures/githubUser.json';
import { mapProfile } from './mapProfile.js';

const NOW = new Date('2026-11-21T00:00:00Z');

/**
 * @param {Partial<import('./githubClient.js').GithubRepo>} overrides
 * @returns {import('./githubClient.js').GithubRepo}
 */
function repo(overrides) {
  return {
    name: 'project',
    stargazers_count: 0,
    language: null,
    fork: false,
    archived: false,
    pushed_at: '2026-11-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * @param {Partial<import('./githubClient.js').GithubUser>} [overrides]
 * @returns {import('./githubClient.js').GithubUser}
 */
function user(overrides) {
  return { ...userFixture, ...overrides };
}

describe('with a real GitHub response', () => {
  const profile = mapProfile(userFixture, reposFixture, NOW);

  test('identifies the account', () => {
    expect(profile).toMatchObject({
      login: 'torvalds',
      name: 'Linus Torvalds',
      profileUrl: 'https://github.com/torvalds',
      accountAge: { value: 15, unit: 'year' },
    });
  });

  test('requests the avatar at twice its rendered size', () => {
    expect(profile.avatarUrl).toBe('https://avatars.githubusercontent.com/u/1024025?v=4&s=128');
  });

  test('leaves forks and archived repositories out of stars, languages and top repos', () => {
    const names = profile.topRepos.map((topRepo) => topRepo.name);

    expect(names).toEqual(['linux', 'AudioNoise', 'GuitarPedal']);
    // The archived OpenSCAD project and the C++ fork are both excluded.
    expect(profile.languages).toEqual([{ name: 'C', count: 8, percent: 100 }]);
    expect(profile.starLabel).toBe('268K');
  });

  test('links top repositories on github.com', () => {
    expect(profile.topRepos[0]).toEqual({
      name: 'linux',
      url: 'https://github.com/torvalds/linux',
      starLabel: '256.2K',
    });
  });

  test('measures the last push from the injected time', () => {
    expect(profile.lastShippedLabel).toBe('2 hours ago');
  });

  test('is not partial when every repository was read', () => {
    expect(profile.isPartial).toBe(false);
  });
});

test('handles an account with no repositories', () => {
  const profile = mapProfile(user({ public_repos: 0 }), [], NOW);

  expect(profile).toMatchObject({
    publicRepoLabel: '0',
    starLabel: '0',
    languages: [],
    topRepos: [],
    lastShippedLabel: null,
    isPartial: false,
  });
});

test('counts nothing when every repository is a fork, but still reports the last push', () => {
  const repos = [
    repo({ name: 'a', fork: true, stargazers_count: 900, language: 'Go' }),
    repo({ name: 'b', fork: true, stargazers_count: 50, language: 'Rust' }),
  ];

  const profile = mapProfile(user({ public_repos: 2 }), repos, NOW);

  expect(profile.starLabel).toBe('0');
  expect(profile.languages).toEqual([]);
  expect(profile.topRepos).toEqual([]);
  expect(profile.lastShippedLabel).toBe('2 weeks ago');
});

test('ignores repositories without a primary language', () => {
  const repos = [
    repo({ name: 'docs', language: null }),
    repo({ name: 'notes', language: null }),
    repo({ name: 'tool', language: 'Go' }),
  ];

  expect(mapProfile(user(), repos, NOW).languages).toEqual([
    { name: 'Go', count: 1, percent: 100 },
  ]);
});

test('returns the top five languages, largest first, ties in alphabetical order', () => {
  const languageCounts = { Go: 4, Rust: 3, C: 2, Zig: 2, Ada: 1, Lua: 1, Perl: 1 };
  const repos = Object.entries(languageCounts).flatMap(([language, count]) =>
    Array.from({ length: count }, (_, index) => repo({ name: `${language}-${index}`, language })),
  );

  const languages = mapProfile(user(), repos, NOW).languages;

  expect(languages.map((language) => language.name)).toEqual(['Go', 'Rust', 'C', 'Zig', 'Ada']);
  expect(languages.map((language) => language.percent)).toEqual([29, 21, 14, 14, 7]);
});

test('falls back to the login when the name is missing or blank', () => {
  expect(mapProfile(user({ name: null }), [], NOW).name).toBe('torvalds');
  expect(mapProfile(user({ name: '   ' }), [], NOW).name).toBe('torvalds');
});

test('reports a missing or blank bio as null', () => {
  expect(mapProfile(user({ bio: null }), [], NOW).bio).toBeNull();
  expect(mapProfile(user({ bio: '  ' }), [], NOW).bio).toBeNull();
  expect(mapProfile(user({ bio: ' Builds things. ' }), [], NOW).bio).toBe('Builds things.');
});

test('formats very large star counts compactly', () => {
  const repos = [repo({ name: 'huge', stargazers_count: 4_200_000_000 })];

  const profile = mapProfile(user(), repos, NOW);

  expect(profile.starLabel).toBe('4.2B');
  expect(profile.topRepos[0]?.starLabel).toBe('4.2B');
});

test('treats a missing star count as zero', () => {
  const repos = [repo({ name: 'new', stargazers_count: undefined })];

  expect(mapProfile(user(), repos, NOW).starLabel).toBe('0');
});

test.each([
  ['2011-09-03T15:26:22Z', { value: 15, unit: 'year' }],
  ['2026-06-20T00:00:00Z', { value: 5, unit: 'month' }],
  ['2026-11-09T00:00:00Z', { value: 12, unit: 'day' }],
  ['2026-11-21T00:00:00Z', { value: 0, unit: 'day' }],
])('an account created at %s is %o old', (createdAt, expected) => {
  expect(mapProfile(user({ created_at: createdAt }), [], NOW).accountAge).toEqual(expected);
});

test('is partial when the account has more repositories than were read', () => {
  expect(mapProfile(user({ public_repos: 300 }), [repo({})], NOW).isPartial).toBe(true);
});

test.each([
  ['a missing avatar', null],
  ['an avatar on another host', 'https://evil.example/avatar.png'],
  ['an avatar over plain http', 'http://avatars.githubusercontent.com/u/1'],
  ['a value that is not a URL', 'javascript:alert(1)'],
])('refuses %s', (_reason, avatarUrl) => {
  expect(mapProfile(user({ avatar_url: avatarUrl }), [], NOW).avatarUrl).toBeNull();
});

test('builds repository links itself, so they cannot leave github.com', () => {
  const repos = [repo({ name: 'weird name/../x', html_url: 'https://evil.example/' })];

  expect(mapProfile(user(), repos, NOW).topRepos[0]?.url).toBe(
    'https://github.com/torvalds/weird%20name%2F..%2Fx',
  );
});

test('gives the same output for the same inputs', () => {
  expect(mapProfile(userFixture, reposFixture, NOW)).toEqual(
    mapProfile(userFixture, reposFixture, NOW),
  );
});
