import { useTheme } from '../../app/providers/ThemeProvider.jsx';
import Icon from '../ui/Icon.jsx';
import styles from './ThemeToggle.module.css';

/**
 * Switches between the light and dark themes. The label names the theme the
 * button switches to, so it always says what pressing it will do.
 *
 * @param {{ labels: { toDark: string, toLight: string } }} props
 */
export default function ThemeToggle({ labels }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={styles.toggle}
      type="button"
      aria-label={isDark ? labels.toLight : labels.toDark}
      onClick={toggleTheme}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  );
}
