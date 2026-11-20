import { useEffect, useState } from 'react';

import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import VisuallyHidden from '../../components/ui/VisuallyHidden.jsx';

/** How long the confirmation stays before the button returns to rest. */
const FEEDBACK_MS = 2500;

/**
 * Copies the page's address (which carries `?u=<username>`) to the clipboard.
 * The outcome replaces the button's label for a moment, so it is visible
 * without moving anything, and is announced through a status region.
 *
 * @param {{ content: { copyLink: string, copied: string, copyFailed: string, copyFailedDetail: string } }} props
 */
export default function CopyLinkButton({ content }) {
  const [outcome, setOutcome] = useState(/** @type {'copied' | 'failed' | null} */ (null));

  useEffect(() => {
    if (outcome === null) {
      return undefined;
    }
    const timer = setTimeout(() => setOutcome(null), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [outcome]);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setOutcome('copied');
    } catch {
      // Clipboard access can be denied; the visitor is told where the link is.
      setOutcome('failed');
    }
  };

  const labels = { copied: content.copied, failed: content.copyFailed };
  const announcements = { copied: content.copied, failed: content.copyFailedDetail };

  return (
    <>
      <Button onClick={handleClick}>
        <Icon name={outcome === 'copied' ? 'check' : 'copy'} />
        {outcome ? labels[outcome] : content.copyLink}
      </Button>
      <VisuallyHidden>
        <span role="status">{outcome ? announcements[outcome] : ''}</span>
      </VisuallyHidden>
    </>
  );
}
