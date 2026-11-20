import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import CardFrame from './CardFrame.jsx';
import styles from './ProofCardNotice.module.css';

/**
 * The card when a lookup failed: what happened, and what to do about it.
 *
 * @param {object} props
 * @param {string} props.productName
 * @param {string} props.kind
 * @param {string} props.message
 * @param {{ label: string, onClick: () => void }} [props.retry] Offered when trying again can help.
 * @param {{ label: string, usernames: string[], onOpen: (username: string) => void }} [props.examples]
 *   Saved cards, offered when GitHub's limit is the problem.
 */
export default function ProofCardNotice({ productName, kind, message, retry, examples }) {
  return (
    <CardFrame productName={productName} kind={kind}>
      <div className={styles.notice}>
        <span className={styles.icon}>
          <Icon name="alert" />
        </span>
        <p className={styles.message}>{message}</p>

        {retry ? <Button onClick={retry.onClick}>{retry.label}</Button> : null}

        {examples ? (
          <div className={styles.examples}>
            <p className={styles.caption} id="proof-card-examples">
              {examples.label}
            </p>
            <ul className={styles.list} aria-labelledby="proof-card-examples">
              {examples.usernames.map((username) => (
                <li key={username}>
                  <Button onClick={() => examples.onOpen(username)}>@{username}</Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </CardFrame>
  );
}
