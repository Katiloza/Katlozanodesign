/**
 * Source of truth for the home page work strip.
 * Copy is lifted from /My Works — never invent metrics or quotes here.
 * Adding a project = adding an entry. The strip layout does not change.
 */

export type Project = {
  slug: string
  /** Card eyebrow — context, not a category label. */
  kicker: string
  title: string
  /** One line. This is the whole pitch on the card. */
  outcome: string
  role: string
  timeframe: string
  /** AA-checked against --canvas (#faf8f4). See tokens.css. */
  accent: string
  /** Second variable per study, per the accent+one-more rule. */
  orientation: 'portrait' | 'landscape' | 'square'
  href: string
  image?: { src: string; alt: string }
}

export const projects: Project[] = [
  {
    slug: 'living-guideline',
    kicker: 'Mayo Clinic–affiliated · Health tech',
    title: 'Optimizing the Living Guideline',
    outcome:
      'Turning a researcher’s evidence platform into a tool an oncologist can trust mid-consult.',
    role: 'Lead UX/UI Designer',
    timeframe: 'Jan – May 2026',
    accent: '#c008b1',
    orientation: 'landscape',
    href: '/work/living-guideline',
    // [NEEDS COPY] — hero still from the hi-fi prototype
  },
  {
    slug: 'edl-migration',
    kicker: 'EdPlus at ASU · Internal web',
    title: 'Facilitation Best Practices Migration',
    outcome:
      'Moving orphaned instructional design content into the EDL platform under a new Course Design structure.',
    role: 'UX / Product Support',
    timeframe: 'Launched Jan 2026',
    accent: '#a4400f',
    orientation: 'portrait',
    href: '/work/edl-migration',
    // [NEEDS COPY] — before/after IA screenshot
  },
  {
    slug: 'sensee',
    kicker: '72-hour sprint · Hardware + iOS',
    title: 'Sensee',
    outcome:
      'A body awareness interface for the signals you’ve learned to ignore.',
    role: 'Strategy + Design',
    timeframe: '2026',
    accent: '#14655a',
    orientation: 'square',
    href: '/work/sensee',
    // [NEEDS COPY] — waterline hero screen
  },
]
