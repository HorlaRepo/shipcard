import Section from '../components/ui/Section.jsx';

/**
 * @typedef {object} WaitlistContent
 * @property {string} id
 * @property {string} title
 * @property {string} lead
 */

/**
 * The closing call to action. The form is passed in as children, so this
 * section stays layout only.
 *
 * @param {{ content: WaitlistContent, children?: import('react').ReactNode }} props
 */
export default function Waitlist({ content, children }) {
  return (
    <Section id={content.id} title={content.title} lead={content.lead}>
      {children}
    </Section>
  );
}
