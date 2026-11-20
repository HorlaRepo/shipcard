/**
 * Every way a lookup can fail, as the visitor experiences it. The GitHub
 * client maps transport failures (src/lib/http.js) onto these, and the UI
 * chooses its message and recovery actions from `kind`.
 */

/**
 * @typedef {'not-found' | 'rate-limit' | 'timeout' | 'network' | 'upstream'} LookupErrorKind
 */

/** Base class, so callers can tell a lookup failure from a programming error. */
export class LookupError extends Error {
  /**
   * @param {LookupErrorKind} kind
   * @param {string} message
   * @param {ErrorOptions} [options]
   */
  constructor(kind, message, options) {
    super(message, options);
    this.name = 'LookupError';
    this.kind = kind;
  }
}

/** GitHub has no user with this name. */
export class NotFoundError extends LookupError {
  /** @param {string} username */
  constructor(username) {
    super('not-found', `No GitHub user called ${username}`);
    this.name = 'NotFoundError';
    this.username = username;
  }
}

/**
 * GitHub refused the request because of a rate limit. `resetAt` is set for the
 * hourly primary limit and null for a secondary (abuse) limit, which gives no
 * exact time.
 */
export class RateLimitError extends LookupError {
  /** @param {Date | null} resetAt */
  constructor(resetAt) {
    super('rate-limit', 'GitHub rate limit reached');
    this.name = 'RateLimitError';
    this.resetAt = resetAt;
  }
}

/** GitHub did not answer in time. */
export class TimeoutError extends LookupError {
  /** @param {number} timeoutMs */
  constructor(timeoutMs) {
    super('timeout', `GitHub did not answer within ${timeoutMs} ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/** The request never reached GitHub. */
export class NetworkError extends LookupError {
  /** @param {unknown} cause */
  constructor(cause) {
    super('network', 'Could not reach GitHub', { cause });
    this.name = 'NetworkError';
  }
}

/** GitHub answered with a server error or a body this page cannot read. */
export class UpstreamError extends LookupError {
  /** @param {unknown} cause */
  constructor(cause) {
    super('upstream', 'GitHub returned an unexpected response', { cause });
    this.name = 'UpstreamError';
  }
}
