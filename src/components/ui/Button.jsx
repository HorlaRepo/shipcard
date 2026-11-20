import styles from './Button.module.css';

/**
 * @typedef {object} ButtonProps
 * @property {import('react').ReactNode} children
 * @property {'primary' | 'secondary'} [variant] Primary is the one yellow action in view.
 * @property {string} [href] When set, the control navigates and renders as a link.
 * @property {'button' | 'submit'} [type] Only for the button form.
 * @property {boolean} [isDisabled] Only for the button form.
 * @property {() => void} [onClick]
 */

/**
 * The page's one button style, as a link when it navigates and a button when
 * it acts, so each keeps its native keyboard behaviour and role.
 *
 * @param {ButtonProps} props
 */
export default function Button({
  children,
  variant = 'secondary',
  href,
  type = 'button',
  isDisabled = false,
  onClick,
}) {
  const className = `${styles.button} ${styles[variant]}`;

  if (href !== undefined) {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type={type} disabled={isDisabled} onClick={onClick}>
      {children}
    </button>
  );
}
