---
name: Shipcard
description: A landing page built on freight paperwork. The proof card is a waybill for a developer's public work.
---

# Design System: Shipcard

This file is the visual authority for the page. It was written once, in Phase 1, before any section was styled. A later visual change must cite a rule here or update this file with a decision log row.

Every value below has a token in [`src/styles/tokens.css`](../src/styles/tokens.css). The contrast ratios are not only recorded here: `src/styles/tokens.test.js` reads the token file and fails the build if a pairing drops below its threshold.

## Overview

### How the direction was chosen

Impeccable's new-work process was followed on paper (decision log L-01 explains why its launcher was not run, and L-08 why the choice was made by judgment rather than its random deal).

- **The mechanism, in one sentence.** Shipcard turns the public record of what a developer has shipped into a single card that someone else can check.
- **The scene.** A developer between jobs, late in the evening, sending one link instead of a three-page CV. On the other side, an engineer screening forty applicants on a laptop between meetings, who wants evidence in ten seconds.
- **What this surface must prove.** That the card is real. The visitor types a username and watches it get built from live data.
- **The page this category always ships** (kept out): a near-black developer-tool page with a neon accent, a glowing gradient blob, monospace headings and a fake terminal. **Its predictable opposite** (also kept out): cream paper, a serif headline and a lot of air.

Seven candidate worlds from the audience's own surroundings, ordered by how well each carries the mechanism:

| #   | World                                           | Why it fits                                                                                                                          | Why it won or lost                                                                                              |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | **The waybill**: freight labels and consignment | Developers already say "shipped". A waybill is a card of checkable facts about a shipment: who sent it, what is in it, when it left. | **Chosen.** Every field on the proof card has a counterpart on a real label, so nothing is decoration.          |
| 2   | Trading cards                                   | A card of one person's statistics, made to be shown to others.                                                                       | Turns work into a game score. Rarity foils and ratings invite exactly the ranking the product should not imply. |
| 3   | The printer's press proof                       | "Proof" is the product's word; colour bars and crop marks are a known graphic system.                                                | Needs off-white stock and fine marks, which lands on the paper-and-serif page that was ruled out.               |
| 4   | Hallmarks stamped in metal                      | A hallmark certifies that something is what it claims to be.                                                                         | Unfamiliar to most of the audience and hard to draw without imitating a material in CSS.                        |
| 5   | The engineering drawing title block             | Drawn by, checked by, date, revision: engineers sign their work.                                                                     | Brings a blueprint grid, a texture this page has no drawing under.                                              |
| 6   | Passport stamps                                 | A dated record of where someone has been.                                                                                            | Says "travel", not "work", and leans on rotated-stamp ornament.                                                 |
| 7   | The contribution graph                          | The audience's own data graphic.                                                                                                     | It is GitHub's identity, not Shipcard's, and it rewards daily activity over finished work.                      |

### The world

Freight paperwork: adhesive label stock on a carton-grey ground, heavy condensed capitals for the things you must not miss, small typewritten captions over each field, hairline rules dividing a form, and one hi-vis yellow used the way a warehouse uses it, to mark the single thing that needs attention.

**The Counterpart Rule.** Every element on the page has a counterpart on real freight paperwork, or it is plain. A caption over a field, a ruled table, a barcode that encodes something: yes. A barcode that encodes nothing, a "FRAGILE" sticker, a rotated rubber stamp: no. The world is a working system, not a costume.

### Imagery

The page has no photographs and no illustration. The only images are GitHub avatars inside cards and the barcode on each card, which is a real Code 39 encoding of the username (Code 39's alphabet is capital letters, digits and the hyphen, which is exactly the alphabet of a GitHub username).

### Motion

One authored moment: the card arriving when a lookup succeeds, like a label leaving a printer (a short rise and fade). Everything else is a state change that takes under a third of a second. Motion tokens and rules are in [Motion](#motion).

## Colors

One ground, one surface, one ink, one accent. Colour never carries meaning alone: every state also has text or an icon.

### Primary

- **Hi-vis yellow** (`--color-accent`, `#FFD500` in both themes). Fills only: the primary button, the highlighter stroke under two words of the headline, the recommended pricing tier's header, the selected state of the billing toggle. Text on it is always **Label ink** (`--color-on-accent`, `#15140F`).

**The One Marker Rule.** Yellow marks at most one thing per screenful, the thing the visitor should act on. If two yellow fills are visible at once and neither is a selected state, one of them is wrong.

**The No Yellow Text Rule.** In the light theme yellow is never text, an icon or a hairline: it measures 1.2:1 on the ground. Because of that, a yellow fill in the light theme always carries a 1px ink edge (`--color-accent-edge`) so its boundary does not depend on the fill.

### Neutral

| Role                                 | Token                 | Light     | Dark      |
| ------------------------------------ | --------------------- | --------- | --------- |
| Carton ground: the page              | `--color-ground`      | `#EDEAE3` | `#11110E` |
| Label stock: cards, inputs, tables   | `--color-surface`     | `#FFFFFF` | `#1C1B17` |
| Ink: text, strong rules              | `--color-ink`         | `#15140F` | `#F2EFE7` |
| Faded ink: captions, secondary text  | `--color-ink-muted`   | `#55524A` | `#A9A599` |
| Control edge: input and chip borders | `--color-control`     | `#77736A` | `#8D897D` |
| Hairline: decorative dividers only   | `--color-rule`        | `#C9C5BA` | `#34322B` |
| Edge of a yellow fill                | `--color-accent-edge` | `#15140F` | `#FFD500` |
| Focus ring                           | `--color-focus`       | `#15140F` | `#FFD500` |
| Problem: error text and icons        | `--color-danger`      | `#A3231C` | `#FF9388` |
| Confirmed: success text and icons    | `--color-success`     | `#1B6435` | `#7FD6A0` |

The language bar on the card is a five-step ramp of ink mixed into the surface (`--color-ramp-1` to `--color-ramp-5`: 100%, 72%, 52%, 36%, 22%). It is one hue on purpose: a different colour per language would put five accents in the card. The bar is outlined in ink and every segment is also listed by name and percentage, so the ramp never carries the data alone.

### Measured contrast

WCAG 2.2 relative-luminance contrast, measured from the hex values above. Thresholds: 4.5:1 for text, 3:1 for large text, control boundaries and the focus ring.

| Pairing                         | Light   | Dark    | Needs |
| ------------------------------- | ------- | ------- | ----- |
| Ink on ground                   | 15.35:1 | 16.46:1 | 4.5   |
| Ink on surface                  | 18.44:1 | 15.00:1 | 4.5   |
| Faded ink on ground             | 6.49:1  | 7.68:1  | 4.5   |
| Faded ink on surface            | 7.80:1  | 7.00:1  | 4.5   |
| Label ink on yellow             | 12.97:1 | 12.97:1 | 4.5   |
| Problem on surface              | 7.46:1  | 8.03:1  | 4.5   |
| Problem on ground               | 6.21:1  | 8.81:1  | 4.5   |
| Confirmed on surface            | 7.19:1  | 9.87:1  | 4.5   |
| Confirmed on ground             | 5.98:1  | 10.83:1 | 4.5   |
| Control edge on surface         | 4.72:1  | 4.93:1  | 3     |
| Control edge on ground          | 3.93:1  | 5.41:1  | 3     |
| Focus ring on ground            | 15.35:1 | 13.30:1 | 3     |
| Focus ring on surface           | 18.44:1 | 12.12:1 | 3     |
| Edge of a yellow fill on ground | 15.35:1 | 13.30:1 | 3     |

The hairline (`--color-rule`) measures about 1.4:1 by design. It only ever separates content that is already separated by space, so it is never the boundary of a control.

## Typography

Two families, both self-hosted as subset WOFF2 under the SIL Open Font License.

- **Archivo** (variable: weight 400–800, width 62–100; 32 KB). One file gives both voices: the page's body text at normal width, and the condensed capitals of the display voice at width 62. It is preloaded, because it sets the headline.
- **IBM Plex Mono 500** (8 KB). The typewritten voice of a label: field captions, usernames, counts, dates and code. It is used for data and measurement only, never to make a heading look technical.

| Role          | Token            | Face and setting                                  | Size                                       |
| ------------- | ---------------- | ------------------------------------------------- | ------------------------------------------ |
| Display       | `--text-display` | Archivo 800, width 62, capitals, leading 0.92     | `clamp(2.75rem, 1.2rem + 7.6vw, 6rem)`     |
| Section title | `--text-title`   | Archivo 800, width 62, capitals, leading 1        | `clamp(2rem, 1.4rem + 2.9vw, 3.5rem)`      |
| Heading       | `--text-heading` | Archivo 700, width 75, leading 1.15               | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` |
| Lead          | `--text-lead`    | Archivo 400, leading 1.5                          | `clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)`  |
| Body          | `--text-body`    | Archivo 400, leading 1.6                          | `1rem`                                     |
| Small         | `--text-small`   | Archivo 400, leading 1.5                          | `0.875rem`                                 |
| Caption       | `--text-caption` | Plex Mono 500, capitals, tracking 0.06em          | `0.75rem`                                  |
| Data          | `--text-data`    | Plex Mono 500, tabular figures                    | `0.875rem`                                 |
| Figure        | `--text-figure`  | Archivo 800, width 62, tabular figures, leading 1 | `clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem)`   |

**The Two Voices Rule.** Condensed capitals say the thing that must not be missed: the headline, section titles, the big figures. The typewriter says a fact about a field. If a piece of text is neither, it is body text.

**The No Kicker Rule.** No small label sits above a heading. A caption belongs over a field of data, never over a title.

Body text is held to a measure of 65 characters (`--measure`). Display tracking is 0 and never goes below -0.02em; condensed capitals are already tight.

## Layout

- **Container.** Content is held to 72rem (`--container-max`) with a fluid gutter (`--gutter`, `clamp(1rem, 4vw, 2.5rem)`).
- **Spacing scale** (`--space-1` to `--space-10`): 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8 rem. Sections are separated by `--section-gap` (`clamp(4rem, 2rem + 8vw, 8rem)`).
- **Breakpoints**, mobile-first, named once in `tokens.css` as custom media: `--from-sm` 40rem, `--from-md` 60rem, `--from-lg` 80rem.
- **The Ruled Form Rule.** The page is a form divided by rules, not a stack of boxes. Sections are separated by a full-width ink rule and space; lists of things (features, FAQ, footer links) are ruled rows. A box is used only where there is a physical object: the card, an input, the pricing table.
- **Left-aligned.** Text aligns to the left edge of the container. Nothing is centred except the contents of a button.
- **The hero** sets the headline across the full container, with the dispatch desk below it: the form on the left, the card on the right. On narrow screens they stack in the order headline, form, card.

## Elevation & Depth

Depth is declared once. The proof card is the only object that sits above the page, so it is the only thing with a shadow (`--shadow-label`: a 1px contact shadow plus a soft 32px drop offset downward). It has no border. Everything else is flat and separated by rules; nothing has both a border and a shadow.

The sticky header gains a hairline under it once the page has scrolled, and no shadow.

## Shapes

Label stock is die-cut with barely rounded corners.

| Token         | Value | Used for                                     |
| ------------- | ----- | -------------------------------------------- |
| `--radius-sm` | 2px   | Chips, avatars, highlighter stroke, the bar  |
| `--radius-md` | 4px   | Buttons, inputs, the card, the pricing table |

There are no pills and no circles. Hairlines are 1px (`--rule-width`); strong rules and the focus ring are 2px (`--rule-strong`).

## Components

- **Button.** Primary: yellow fill, ink text and edge, Archivo 700 at width 75. Secondary: surface fill with a control edge. Quiet: text with an underline. Minimum target 44 × 44 px (`--target-min`). Pressing scales the button to 0.97.
- **Field.** A caption-sized visible label above a surface-coloured input with a control edge. The error message sits below, in the problem colour, with an icon.
- **Chip.** A small secondary button used for example usernames.
- **Proof card.** Label stock. A header strip (product name, handle), then the avatar and name, a row of three figures, the language bar, the top repositories as ruled rows, and a footer with the last-shipped line and the barcode. Its empty state is the same label, unfilled: captions over blank rules.
- **Ruled list.** A term in the heading voice on the left, body text on the right, a hairline between rows. Used by Features and FAQ.
- **Rate table.** Pricing tiers as columns of one table-like surface, not three floating cards.

## Motion

| Token               | Value                            | Used for                                       |
| ------------------- | -------------------------------- | ---------------------------------------------- |
| `--duration-fast`   | 120ms                            | Press, hover, colour changes                   |
| `--duration-base`   | 200ms                            | Toggles, disclosure, header, menu              |
| `--duration-slow`   | 320ms                            | The card arriving; scroll reveals              |
| `--ease-out`        | `cubic-bezier(0.16, 1, 0.3, 1)`  | Anything entering or responding to the visitor |
| `--ease-in-out`     | `cubic-bezier(0.65, 0, 0.35, 1)` | Something moving between two resting positions |
| `--reveal-distance` | 0.75rem                          | How far an entering element travels            |

- Only `transform` and `opacity` are animated.
- Nothing bounces or overshoots, and no interaction takes longer than `--duration-slow`.
- Under `prefers-reduced-motion: reduce`, movement is removed and state changes are instant or a plain fade; no information depends on motion.
- Hover effects sit behind `@media (hover: hover)`.

## Do's and Don'ts

### Do

- Mark one thing per screenful in yellow.
- Put a typewritten caption over a field of data, and nowhere else.
- Separate with rules and space.
- Give every state its own words: the empty card, the loading card, each error.
- Take every value from a token.

### Don't

These are the patterns this design exists to avoid.

- No gradients, glows, blurred blobs or glass.
- No dark page with a neon accent, and no terminal window.
- No cards inside cards, and no row of identical icon-heading-text cards. Features are a ruled list.
- No emoji or Unicode glyphs as icons. Icons are authored SVG with a 1.5px stroke.
- No second accent colour. Status colours (problem, confirmed) appear only next to the message they qualify.
- No centred sections.
- No label-prop decoration: no stamps, stickers, tape, torn edges or paper texture.
- No Inter, no system font as the display voice, no monospace headings.
- No bounce or elastic easing; nothing over 320ms.
- No grey text lighter than faded ink.
