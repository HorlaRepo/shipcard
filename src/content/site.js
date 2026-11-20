/**
 * All copy for the page lives in this file. Components receive it as props,
 * so changing a word, a price or the product's name is an edit here and
 * nowhere else.
 */

const NAME = 'Shipcard';
const REPOSITORY_URL = 'https://github.com/HorlaRepo/shipcard';

/** Section ids, shared by the navigation links and the sections they point to. */
const sectionIds = {
  top: 'top',
  demo: 'demo',
  howItWorks: 'how-it-works',
  features: 'features',
  pricing: 'pricing',
  faq: 'faq',
  waitlist: 'waitlist',
};

export const site = {
  name: NAME,
  topId: sectionIds.top,
  mainId: 'main',
};

export const skipLink = {
  label: 'Skip to main content',
};

export const navigation = {
  label: 'Sections',
  homeLabel: `${NAME}, back to top`,
  links: [
    { label: 'How it works', href: `#${sectionIds.howItWorks}` },
    { label: 'Features', href: `#${sectionIds.features}` },
    { label: 'Pricing', href: `#${sectionIds.pricing}` },
    { label: 'FAQ', href: `#${sectionIds.faq}` },
  ],
  cta: { label: 'Join the waitlist', href: `#${sectionIds.waitlist}` },
  theme: {
    toDark: 'Switch to the dark theme',
    toLight: 'Switch to the light theme',
  },
  menu: {
    openLabel: 'Open menu',
    closeLabel: 'Close menu',
    dialogLabel: 'Menu',
  },
};

export const hero = {
  id: sectionIds.demo,
  title: {
    opening: 'Your résumé says what you know.',
    closing: 'Your code',
    marked: 'proves it.',
  },
  lead: `${NAME} turns a GitHub username into a proof-of-work card: what you have built, what you build with, and when you last shipped. Try it on any public account.`,
};

export const proofCard = {
  productName: NAME,
  form: {
    label: 'GitHub username',
    hint: 'A username, an @handle or a profile link.',
    submit: 'Generate my card',
    examplesLabel: 'Or try one',
    quotaHint: 'Live lookups left this hour on your network: {count}.',
    problems: {
      empty: 'Type a GitHub username first.',
      invalid:
        'That is not a valid GitHub username. Use letters, numbers and single hyphens, up to 39 characters.',
      notFound: 'No GitHub user called @{username}. Check the spelling and try again.',
    },
  },
  empty: {
    title: 'Your card prints here',
    body: 'Type a username to build it from live GitHub data.',
  },
  loading: 'Building the card for @{username}',
  errors: {
    rateLimit:
      'GitHub’s limit for this network resets at {time}. Open a saved example card in the meantime.',
    rateLimitUnknown:
      'GitHub is throttling requests from this network. Try again in a minute, or open a saved example card.',
    timeout: 'GitHub took longer than {seconds} seconds to answer.',
    offline: 'You appear to be offline. Reconnect, then try again.',
    network: 'We could not reach GitHub. Check your connection, then try again.',
    upstream: 'GitHub sent back something we could not read. Try again in a moment.',
    render: 'This card could not be drawn. Reload the page to try again.',
    retry: 'Try again',
    examplesLabel: 'Saved example cards',
  },
  card: {
    kind: 'Proof of work',
    captions: {
      repos: 'Repos',
      stars: 'Stars',
      age: 'Age',
      languages: 'Top languages',
      topRepos: 'Most starred',
      lastShipped: 'Last shipped',
    },
    ageUnits: { year: '{value} yr', month: '{value} mo', day: '{value} d' },
    starsSuffix: 'stars',
    noLanguages: 'No languages detected yet.',
    noRepos: 'No original public repositories yet.',
    neverShipped: 'Nothing pushed yet',
    countingRule: 'Forks and archived repositories are not counted.',
    partialRule:
      'Counts the 100 most recently pushed repositories, without forks or archived ones.',
    snapshot: 'Snapshot from {date}',
    profileLink: 'View @{login} on GitHub',
  },
  actions: {
    copyLink: 'Copy link',
    copied: 'Link copied',
    copyFailed: 'Copy failed',
    copyFailedDetail: 'The link could not be copied. It is in your address bar.',
    clear: 'Clear',
  },
};

export const howItWorks = {
  id: sectionIds.howItWorks,
  title: 'From username to proof in three steps',
  steps: [
    {
      title: 'Type a username',
      body: 'Any public GitHub account works. There is no sign-in and no token, and private work stays private.',
    },
    {
      title: 'We read the public record',
      body: 'Your browser makes two requests to GitHub: one for the profile, one for its repositories. Forks and archived projects are left out, so the card counts work that is yours and still alive.',
    },
    {
      title: 'Send one link',
      body: 'The card lives at a URL with the username in it. Put it in an application, and whoever opens it sees the same card, built fresh.',
    },
  ],
};

export const features = {
  id: sectionIds.features,
  title: 'What the card shows, and why it holds up',
  items: [
    {
      title: 'Checked against the source',
      body: 'Every figure comes from GitHub at the moment the card is opened. Nobody types in their own numbers.',
    },
    {
      title: 'Your work, not your forks',
      body: 'Forks and archived repositories are left out of the stars, the languages and the top projects. The card says so on its face.',
    },
    {
      title: 'Languages by what you build',
      body: 'Each repository counts once, under its primary language. The card shows your top five and the share each one holds.',
    },
    {
      title: 'Recency that is hard to fake',
      body: '“Shipped 3 days ago” is the time of your latest push to a public repository, read from GitHub and not from you.',
    },
    {
      title: 'One link, nothing to install',
      body: 'A card is a URL. It opens in any browser, in light or dark, on a phone or a laptop.',
    },
  ],
};

export const pricing = {
  id: sectionIds.pricing,
  title: 'Free to make a card. Paid when you need more.',
  lead: `Prices are in US dollars. ${NAME} is a demo project, so nothing here can be bought yet.`,
  currency: 'USD',
  billing: {
    legend: 'Billing period',
    monthly: 'Monthly',
    annual: 'Annual',
    annualNote: 'save 25%',
    billedMonthly: 'Billed every month',
    billedAnnually: 'Billed as {total} once a year',
    free: 'Free for good',
  },
  perMonth: 'per month',
  perSeatPerMonth: 'per seat, per month',
  recommendedLabel: 'The one for a job search',
  tiers: [
    {
      id: 'free',
      name: 'Free',
      summary: 'One card, to send yourself.',
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      isPerSeat: false,
      isRecommended: false,
      features: [
        'A live card for any public account',
        'A link you can share',
        'Light and dark themes',
      ],
      cta: { label: 'Generate my card', href: `#${sectionIds.demo}` },
    },
    {
      id: 'pro',
      name: 'Pro',
      summary: 'For an active job search.',
      monthlyPrice: 8,
      annualMonthlyPrice: 6,
      isPerSeat: false,
      isRecommended: true,
      features: [
        'Everything in Free',
        'Choose which repositories lead the card',
        'A short link with your name in it',
        'Private-repository counts, verified by GitHub sign-in',
      ],
      cta: { label: 'Join the waitlist for Pro', href: `#${sectionIds.waitlist}` },
    },
    {
      id: 'team',
      name: 'Team',
      summary: 'For hiring teams reading many cards.',
      monthlyPrice: 20,
      annualMonthlyPrice: 15,
      isPerSeat: true,
      isRecommended: false,
      features: [
        'Everything in Pro',
        'Compare applicants’ cards side by side',
        'Export a shortlist as CSV',
        'Single sign-on',
      ],
      cta: { label: 'Join the waitlist for Team', href: `#${sectionIds.waitlist}` },
    },
  ],
};

export const faq = {
  id: sectionIds.faq,
  title: 'Questions, answered plainly',
  items: [
    {
      id: 'data-source',
      question: 'Where does the data come from?',
      answer: `From GitHub’s public REST API, read by your browser when you ask for a card: one request for the profile and one for the repositories. ${NAME} keeps no database of developers.`,
    },
    {
      id: 'sign-in',
      question: 'Do I need to sign in or hand over a token?',
      answer:
        'No. The demo makes unauthenticated requests, so it sees only what any visitor to github.com can see. There is no token in the page to leak.',
    },
    {
      id: 'rate-limit',
      question: 'Why did I hit a limit?',
      answer:
        'GitHub allows 60 unauthenticated requests an hour from one network address, and each card uses two, which comes to about 30 cards an hour. When you run out, the page tells you the time the limit resets and offers saved example cards in the meantime.',
    },
    {
      id: 'what-counts',
      question: 'Which repositories count?',
      answer:
        'Public repositories you own that are neither forks nor archived, taken from your 100 most recently pushed. Stars, languages and top projects are all counted from that set.',
    },
    {
      id: 'privacy',
      question: 'What do you keep about me?',
      answer:
        'Nothing from the demo: a result stays in your own browser tab for ten minutes and is then discarded. If you join the waitlist, we keep your email address so we can write to you once.',
    },
    {
      id: 'pricing-real',
      question: 'Is the pricing real?',
      answer: `No. ${NAME} is a demo project built for an engineering assessment, and nothing is for sale. The tiers show how the product would be priced.`,
    },
  ],
};

export const waitlist = {
  id: sectionIds.waitlist,
  title: 'Be first to carry a Pro card',
  lead: 'Leave your email address and we will write once, when paid plans open. No newsletter.',
  form: {
    label: 'Email address',
    hint: 'We store this address and nothing else.',
    submit: 'Join the waitlist',
    submitting: 'Joining',
    honeypotLabel: 'Leave this field empty',
    success: 'You are on the list. We will write to {email} once, when paid plans open.',
    problems: {
      empty: 'Enter your email address.',
      invalid: 'That does not look like an email address. Check for a missing @ or domain.',
      rejected: 'The waitlist did not accept that address. Check it and try again.',
      network: 'We could not reach the waitlist. Check your connection, then try again.',
      server: 'The waitlist is not answering just now. Try again in a minute.',
    },
  },
};

export const footer = {
  note: `${NAME} is a demo project and is not affiliated with GitHub. Card data comes from GitHub’s public API.`,
  credits: 'Set in Archivo and IBM Plex Mono.',
  linksLabel: 'More',
  links: [
    { label: 'Source code', href: REPOSITORY_URL, isExternal: true },
    { label: 'GitHub REST API', href: 'https://docs.github.com/en/rest', isExternal: true },
    { label: 'Back to top', href: `#${sectionIds.top}`, isExternal: false },
  ],
};
