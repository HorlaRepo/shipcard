import { useEffect } from 'react';

import Button from '../../components/ui/Button.jsx';
import { useUrlParam } from '../../hooks/useUrlParam.js';
import { fillTemplate, formatClockTime } from '../../lib/format.js';
import { DEFAULT_TIMEOUT_MS } from '../../lib/http.js';
import CopyLinkButton from './CopyLinkButton.jsx';
import { RateLimitError } from './errors.js';
import { EXAMPLE_USERNAMES } from './examples/loadSnapshot.js';
import { parseUsername } from './parseUsername.js';
import ProofCard from './ProofCard.jsx';
import styles from './ProofCardDemo.module.css';
import ProofCardEmpty from './ProofCardEmpty.jsx';
import ProofCardErrorBoundary from './ProofCardErrorBoundary.jsx';
import ProofCardForm from './ProofCardForm.jsx';
import ProofCardNotice from './ProofCardNotice.jsx';
import ProofCardSkeleton from './ProofCardSkeleton.jsx';
import { useGithubProfile } from './useGithubProfile.js';

/** The query parameter that makes a card shareable: `?u=<username>`. */
const USERNAME_PARAM = 'u';
const MS_PER_SECOND = 1000;

/**
 * @typedef {object} ProofCardContent
 * @property {string} productName
 * @property {import('./ProofCardForm.jsx').FormContent} form
 * @property {{ title: string, body: string }} empty
 * @property {string} loading
 * @property {{ rateLimit: string, rateLimitUnknown: string, timeout: string, offline: string, network: string, upstream: string, render: string, retry: string, examplesLabel: string }} errors
 * @property {import('./ProofCard.jsx').CardContent} card
 * @property {{ copyLink: string, copied: string, copyFailed: string, copyFailedDetail: string, clear: string }} actions
 */

/**
 * Chooses the words for a failed lookup.
 *
 * @param {import('./errors.js').LookupError} error
 * @param {ProofCardContent['errors']} content
 * @returns {string}
 */
function describeError(error, content) {
  switch (error.kind) {
    case 'rate-limit':
      return error instanceof RateLimitError && error.resetAt
        ? fillTemplate(content.rateLimit, { time: formatClockTime(error.resetAt) })
        : content.rateLimitUnknown;
    case 'timeout':
      return fillTemplate(content.timeout, { seconds: DEFAULT_TIMEOUT_MS / MS_PER_SECOND });
    case 'network':
      return navigator.onLine ? content.network : content.offline;
    default:
      return content.upstream;
  }
}

/**
 * The live demo and the feature's only public component: a username form and
 * the card it produces, in every state.
 *
 * @param {{ content: ProofCardContent }} props
 */
export default function ProofCardDemo({ content }) {
  const [urlUsername, setUrlUsername] = useUrlParam(USERNAME_PARAM);
  const initialUsername = parseUsername(urlUsername ?? '').username;
  const { state, submit, openSnapshot, reset } = useGithubProfile({ initialUsername });
  const frame = { productName: content.productName, kind: content.card.kind };

  // The address bar follows the card on screen. A saved snapshot is not a
  // live card, so it does not get a shareable address.
  const liveLogin =
    state.status === 'success' && !state.profile.snapshotDateLabel ? state.profile.login : null;
  useEffect(() => {
    if (liveLogin) {
      setUrlUsername(liveLogin);
    }
  }, [liveLogin, setUrlUsername]);

  const handleClear = () => {
    reset();
    setUrlUsername(null);
  };

  const isNotFound = state.status === 'error' && state.error.kind === 'not-found';

  /** @returns {import('react').ReactNode} */
  const renderResult = () => {
    if (state.status === 'loading') {
      return (
        <ProofCardSkeleton
          {...frame}
          label={fillTemplate(content.loading, { username: state.username })}
        />
      );
    }
    if (state.status === 'success') {
      return (
        <>
          <ProofCard
            profile={state.profile}
            productName={frame.productName}
            content={content.card}
          />
          <div className={styles.actions}>
            {liveLogin ? <CopyLinkButton content={content.actions} /> : null}
            <Button onClick={handleClear}>{content.actions.clear}</Button>
          </div>
        </>
      );
    }
    if (state.status === 'error' && !isNotFound) {
      const isRateLimited = state.error.kind === 'rate-limit';
      return (
        <ProofCardNotice
          {...frame}
          message={describeError(state.error, content.errors)}
          retry={
            isRateLimited
              ? undefined
              : { label: content.errors.retry, onClick: () => submit(state.username) }
          }
          examples={
            isRateLimited
              ? {
                  label: content.errors.examplesLabel,
                  usernames: EXAMPLE_USERNAMES,
                  onOpen: (username) =>
                    openSnapshot(
                      /** @type {import('./examples/loadSnapshot.js').ExampleUsername} */ (
                        username
                      ),
                    ),
                }
              : undefined
          }
        />
      );
    }
    return <ProofCardEmpty {...frame} content={content.empty} captions={content.card.captions} />;
  };

  return (
    <div className={styles.demo}>
      <ProofCardForm
        content={content.form}
        examples={EXAMPLE_USERNAMES}
        initialValue={initialUsername ?? ''}
        lookupProblem={
          isNotFound
            ? fillTemplate(content.form.problems.notFound, { username: state.username })
            : null
        }
        quota={state.quota}
        onSubmit={submit}
      />
      <div className={styles.result} aria-live="polite" aria-busy={state.status === 'loading'}>
        <ProofCardErrorBoundary
          fallback={<ProofCardNotice {...frame} message={content.errors.render} />}
        >
          {renderResult()}
        </ProofCardErrorBoundary>
      </div>
    </div>
  );
}
