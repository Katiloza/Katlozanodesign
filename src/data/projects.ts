import cardBgMcrpc from '@/assets/work/card-bg-mcrpc.jpg'
import cardBgTokens from '@/assets/work/card-bg-tokens.jpg'
import shotMcrpc from '@/assets/work/shot-mcrpc.jpg'
import shotTokens from '@/assets/work/shot-tokens.jpg'

export type Project = {
  id: string
  /** Headline on the floating label card. */
  title: string
  /** Shorter title used on the rotated spine of a peeking card. */
  spineTitle: string
  /** What the browser address bar reads. */
  url: string
  /** Card backdrop: an exported bitmap, or a CSS background value. */
  background: { image: string } | { css: string }
  /** Screenshot filling the browser viewport. null until exported. */
  screenshot: string | null
  /** Label-card text colour — each card picks one out of its backdrop. */
  labelColor: string
  /** Spine text colour when this card is the one peeking in. */
  spineColor: string
}

/**
 * Order is left-to-right in the carousel.
 *
 * NOTE: frames 1-5 and 1-126 disagree about which card sits next to
 * "Improving decision support for cancer treatment" — 1-5 puts the design
 * system card to its left, 1-126 puts it to the right of the token card.
 * Both can't hold at once, so the carousel renders real neighbours from
 * this array and each frame is a reachable state of it.
 */
export const projects: Project[] = [
  {
    id: 'design-system',
    title: 'Scaling a design system for enterprise AI',
    spineTitle: 'Scaling a design system for enterprise AI',
    url: 'design-system.internal/components',
    background: {
      css: 'linear-gradient(180deg, #dec9e3 0%, #ddd3e9 18%, #c6b9dc 52%, #bec1f1 82%, #c4ccfa 100%)',
    },
    screenshot: null,
    labelColor: 'var(--color-label-neutral)',
    spineColor: 'var(--color-ink)',
  },
  {
    id: 'mcrpc',
    title: 'Improving decision support for cancer treatment',
    spineTitle: 'Decision support tool for cancer treatment',
    url: 'evidence-synthesis.org/mcrpc/tables',
    background: { image: cardBgMcrpc },
    screenshot: shotMcrpc,
    labelColor: 'var(--color-label-neutral)',
    spineColor: '#ffffff',
  },
  {
    id: 'tokens',
    title: 'Bringing delight in design to code optimization',
    spineTitle: 'Bringing delight in design to code optimization',
    url: 'Interactive Token Naming',
    background: { image: cardBgTokens },
    screenshot: shotTokens,
    labelColor: 'var(--color-label-violet)',
    spineColor: 'var(--color-ink)',
  },
]

export const experience = [
  { org: 'Independent Designer', role: '', dates: '2022 - Present', lead: true },
  { org: 'EdPlus', role: 'User Experience Assistant', dates: '2023 - Present' },
  { org: 'Mayo Clinic', role: 'UX Design + Research (Contract)', dates: '2025 - Present' },
  { org: 'Honeywell Aerospace', role: 'Product externship', dates: 'Aug 2026 - Present' },
]
