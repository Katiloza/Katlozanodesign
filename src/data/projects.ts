import cardBgMcrpc from '@/assets/work/card-bg-mcrpc.jpg'
import cardBgTokens from '@/assets/work/card-bg-tokens.jpg'
import shotMcrpc from '@/assets/work/shot-mcrpc.jpg'
import shotTokens from '@/assets/work/shot-tokens.jpg'

export type Project = {
  id: string
  /** Headline on the floating label card. */
  title: string
  /** Shorter title used on the rotated spine of a collapsed card. */
  spineTitle: string
  /** What the browser address bar reads. */
  url: string
  /** Card backdrop: an exported bitmap, or a CSS background value. */
  background: { image: string } | { css: string }
  /**
   * Fidget mode shows the artwork with the browser window as a separate
   * element, so it needs the plate *without* a window composited into it.
   * `size`/`position` let a card crop the carousel plate down to its clean
   * region until a dedicated export exists.
   */
  fidgetBackground: { image: string; size?: string; position?: string }
  /** Screenshot filling the browser viewport. null until exported. */
  screenshot: string | null
  /** Label-card text colour — each card picks one out of its backdrop. */
  labelColor: string
  /** Label colour when the card is expanded in the carousel. */
  carouselLabelColor: string
  /** Spine text colour when this card is the collapsed one. */
  spineColor: string
}

/**
 * NOTE: `design-system` has no screenshot exported yet, so it is not in
 * `featured` and never renders.
 *
 * To bring it back: export a shot into src/assets/work/, point `screenshot`
 * at it, add the id to `featured`, and add a `cardSpots` entry in
 * FidgetStage (cards without one are filtered out). The carousel handles
 * any number of cards, but three 141px strips plus an expanded card is
 * wider than the row reads well at, so check the geometry.
 */
export const projects: Project[] = [
  {
    id: 'tokens',
    title: 'Bringing delight in design to code optimization',
    spineTitle: 'Bringing delight in design to code optimization',
    url: 'Interactive Token Naming',
    background: { image: cardBgTokens },
    fidgetBackground: { image: cardBgTokens },
    screenshot: shotTokens,
    labelColor: 'var(--color-label-neutral)',
    carouselLabelColor: 'var(--color-label-violet)',
    spineColor: 'var(--color-ink)',
  },
  {
    id: 'mcrpc',
    title: 'Improving decision support for cancer treatment',
    spineTitle: 'Decision support tool for cancer treatment',
    url: 'evidence-synthesis.org/mcrpc/tables',
    background: { image: cardBgMcrpc },
    /*
     * TODO: swap in src/assets/work/fidget-bg-mcrpc.png — the same painting
     * with no browser composited in — and drop the size/position overrides.
     *
     * Until then this reuses the carousel plate. That plate has a browser
     * window baked into it from (209, 122) rightward, and the only part of
     * this card's artwork that is actually exposed is the 156px band above
     * its own browser window. Scaling the plate to 1.35× (1231→1662) puts
     * that band inside the clean sky above y=122, so no second window shows
     * through; the baked one falls below, hidden behind the real window.
     */
    fidgetBackground: { image: cardBgMcrpc, size: '1662px auto', position: 'left top' },
    screenshot: shotMcrpc,
    labelColor: 'var(--color-label-neutral)',
    carouselLabelColor: 'var(--color-label-neutral)',
    spineColor: '#ffffff',
  },
  {
    id: 'design-system',
    title: 'Scaling a design system for enterprise AI',
    spineTitle: 'Scaling a design system for enterprise AI',
    url: 'design-system.internal/components',
    background: {
      css: 'linear-gradient(180deg, #dec9e3 0%, #ddd3e9 18%, #c6b9dc 52%, #bec1f1 82%, #c4ccfa 100%)',
    },
    fidgetBackground: { image: cardBgTokens },
    screenshot: null,
    labelColor: 'var(--color-label-neutral)',
    carouselLabelColor: 'var(--color-label-neutral)',
    spineColor: 'var(--color-ink)',
  },
]

/** The case studies that ship, left-to-right in the carousel. */
export const featuredIds = ['tokens', 'mcrpc'] as const

export const featured = featuredIds
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is Project => Boolean(p))

export const experience = [
  { org: 'Independent Designer', role: '', dates: '2022 - Present', lead: true },
  { org: 'EdPlus', role: 'User Experience Assistant', dates: '2023 - Present' },
  { org: 'Mayo Clinic', role: 'UX Design + Research (Contract)', dates: '2025 - Present' },
  { org: 'Honeywell Aerospace', role: 'Product externship', dates: 'Aug 2026 - Present' },
]
