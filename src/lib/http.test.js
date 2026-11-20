import { delay, http, HttpResponse } from 'msw';
import { expect, test } from 'vitest';

import { server } from '../../tests/msw/server.js';
import {
  getJson,
  HttpBodyError,
  HttpNetworkError,
  HttpStatusError,
  HttpTimeoutError,
  isAbortError,
} from './http.js';

const URL = 'https://example.test/resource';

test('resolves with the parsed body and the response headers', async () => {
  server.use(http.get(URL, () => HttpResponse.json({ ok: true }, { headers: { 'x-test': '1' } })));

  const { data, headers } = await getJson(URL);

  expect(data).toEqual({ ok: true });
  expect(headers.get('x-test')).toBe('1');
});

test('sends the given request headers', async () => {
  server.use(
    http.get(URL, ({ request }) => HttpResponse.json({ accept: request.headers.get('accept') })),
  );

  const { data } = await getJson(URL, { headers: { Accept: 'application/x-test' } });

  expect(data).toEqual({ accept: 'application/x-test' });
});

test('rejects with the status and headers when the response is not 2xx', async () => {
  server.use(
    http.get(URL, () => HttpResponse.json({}, { status: 503, headers: { 'retry-after': '5' } })),
  );

  const error = await getJson(URL).catch((reason) => reason);

  expect(error).toBeInstanceOf(HttpStatusError);
  expect(error.status).toBe(503);
  expect(error.headers.get('retry-after')).toBe('5');
});

test('rejects with a body error when a 2xx response is not JSON', async () => {
  server.use(http.get(URL, () => HttpResponse.text('<html>not json</html>')));

  await expect(getJson(URL)).rejects.toBeInstanceOf(HttpBodyError);
});

test('rejects with a network error when the connection fails', async () => {
  server.use(http.get(URL, () => HttpResponse.error()));

  await expect(getJson(URL)).rejects.toBeInstanceOf(HttpNetworkError);
});

test('rejects with a timeout error when no answer arrives in time', async () => {
  server.use(
    http.get(URL, async () => {
      await delay('infinite');
      return HttpResponse.json({});
    }),
  );

  const error = await getJson(URL, { timeoutMs: 20 }).catch((reason) => reason);

  expect(error).toBeInstanceOf(HttpTimeoutError);
  expect(error.timeoutMs).toBe(20);
});

test('a cancelled request rejects with an AbortError, not a failure', async () => {
  server.use(
    http.get(URL, async () => {
      await delay('infinite');
      return HttpResponse.json({});
    }),
  );
  const controller = new AbortController();

  const pending = getJson(URL, { signal: controller.signal }).catch((reason) => reason);
  controller.abort();
  const error = await pending;

  expect(isAbortError(error)).toBe(true);
});

test('a request cancelled before it starts never reaches the network', async () => {
  let wasRequested = false;
  server.use(
    http.get(URL, () => {
      wasRequested = true;
      return HttpResponse.json({});
    }),
  );

  const error = await getJson(URL, { signal: AbortSignal.abort() }).catch((reason) => reason);

  expect(isAbortError(error)).toBe(true);
  expect(wasRequested).toBe(false);
});
