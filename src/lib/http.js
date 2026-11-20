/**
 * The page's only way to make a request: fetch with a timeout, cancellation
 * and typed errors. No React imports, and nothing here knows about GitHub.
 */

/** How long a request may take before it is abandoned. */
export const DEFAULT_TIMEOUT_MS = 8000;

/** The server answered with a status outside 200–299. */
export class HttpStatusError extends Error {
  /**
   * @param {number} status
   * @param {Headers} headers
   */
  constructor(status, headers) {
    super(`Request failed with status ${status}`);
    this.name = 'HttpStatusError';
    this.status = status;
    this.headers = headers;
  }
}

/** No answer arrived within the timeout. */
export class HttpTimeoutError extends Error {
  /** @param {number} timeoutMs */
  constructor(timeoutMs) {
    super(`Request timed out after ${timeoutMs} ms`);
    this.name = 'HttpTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/** The request never reached a server: offline, DNS failure, blocked by CORS. */
export class HttpNetworkError extends Error {
  /** @param {unknown} cause */
  constructor(cause) {
    super('Network request failed', { cause });
    this.name = 'HttpNetworkError';
  }
}

/** The server answered 2xx, but the body was not JSON. */
export class HttpBodyError extends Error {
  /** @param {unknown} cause */
  constructor(cause) {
    super('Response body was not valid JSON', { cause });
    this.name = 'HttpBodyError';
  }
}

/**
 * Whether an error is a cancellation. Cancelled requests are expected (a newer
 * lookup replaced this one, or the component unmounted) and are never shown.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isAbortError(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * GETs a URL and parses the JSON body.
 *
 * @param {string} url
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] Cancels the request; the promise rejects with an AbortError.
 * @param {number} [options.timeoutMs]
 * @param {Record<string, string>} [options.headers]
 * @returns {Promise<{ data: unknown, headers: Headers }>}
 * @throws {HttpStatusError | HttpTimeoutError | HttpNetworkError | HttpBodyError | DOMException}
 */
export async function getJson(url, { signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers } = {}) {
  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
  const signals = signal ? [signal, timeoutController.signal] : [timeoutController.signal];

  try {
    const response = await fetch(url, { headers, signal: AbortSignal.any(signals) });
    if (!response.ok) {
      throw new HttpStatusError(response.status, response.headers);
    }
    return { data: await parseJson(response), headers: response.headers };
  } catch (error) {
    throw classifyFailure(error, { signal, timeoutController, timeoutMs });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {Response} response
 * @returns {Promise<unknown>}
 */
async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    // An abort while the body is still streaming must stay an abort.
    throw isAbortError(error) ? error : new HttpBodyError(error);
  }
}

/**
 * Turns whatever fetch threw into one of this module's errors. The caller's
 * own cancellation is checked first: if both it and the timeout fired, the
 * caller no longer wants the result, so there is nothing to report.
 *
 * @param {unknown} error
 * @param {object} context
 * @param {AbortSignal} [context.signal]
 * @param {AbortController} context.timeoutController
 * @param {number} context.timeoutMs
 * @returns {unknown}
 */
function classifyFailure(error, { signal, timeoutController, timeoutMs }) {
  if (error instanceof HttpStatusError || error instanceof HttpBodyError) {
    return error;
  }
  if (signal?.aborted) {
    return new DOMException('The request was cancelled', 'AbortError');
  }
  if (timeoutController.signal.aborted) {
    return new HttpTimeoutError(timeoutMs);
  }
  return new HttpNetworkError(error);
}
