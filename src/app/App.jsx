import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';
import SkipLink from '../components/layout/SkipLink.jsx';
import {
  faq,
  features,
  footer,
  hero,
  howItWorks,
  navigation,
  pricing,
  proofCard,
  site,
  skipLink,
  waitlist,
} from '../content/site.js';
import Faq from '../sections/Faq.jsx';
import Features from '../sections/Features.jsx';
import Hero from '../sections/Hero.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import Pricing from '../sections/Pricing.jsx';
import Waitlist from '../sections/Waitlist.jsx';
import ThemeProvider from './providers/ThemeProvider.jsx';

/** Root component: provides the theme, composes the page from its sections and hands each its copy. */
export default function App() {
  return (
    <ThemeProvider>
      <div id={site.topId}>
        <SkipLink label={skipLink.label} targetId={site.mainId} />
        <Header siteName={site.name} homeHref={`#${site.topId}`} navigation={navigation} />
        <main id={site.mainId}>
          <Hero content={hero} demoContent={proofCard} />
          <HowItWorks content={howItWorks} />
          <Features content={features} />
          <Pricing content={pricing} />
          <Faq content={faq} />
          <Waitlist content={waitlist} />
        </main>
        <Footer siteName={site.name} content={footer} />
      </div>
    </ThemeProvider>
  );
}
