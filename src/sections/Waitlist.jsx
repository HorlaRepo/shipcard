import Section from '../components/ui/Section.jsx';
import WaitlistForm from '../features/waitlist/WaitlistForm.jsx';

/**
 * @typedef {object} WaitlistContent
 * @property {string} id
 * @property {string} title
 * @property {string} lead
 * @property {import('../features/waitlist/WaitlistForm.jsx').WaitlistFormContent} form
 */

/**
 * The closing call to action: the waitlist sign-up.
 *
 * @param {{ content: WaitlistContent }} props
 */
export default function Waitlist({ content }) {
  return (
    <Section id={content.id} title={content.title} lead={content.lead}>
      <WaitlistForm content={content.form} />
    </Section>
  );
}
