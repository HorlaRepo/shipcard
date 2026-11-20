import { site } from '../content/site.js';

/** Root component: composes the page from its sections. */
export default function App() {
  return (
    <main>
      <h1>{site.name}</h1>
      <p>{site.tagline}</p>
    </main>
  );
}
