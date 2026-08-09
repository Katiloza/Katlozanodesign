import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { projects } from '@/content/projects'
import { ProjectCard } from './ProjectCard'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Props = {
  /** Reports 0–1 progress so the top bar can say where you are. */
  onProgress?: (progress: number) => void
  onActiveChange?: (index: number) => void
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/* Scroll length is stretched past the card travel so the pin reads as a
   deliberate pause rather than a 1:1 nudge. */
const PIN_STRETCH = 1.8

export function WorkStrip({ onProgress, onActiveChange }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const reducedMotion = usePrefersReducedMotion()
  const wideEnough = useMediaQuery('(min-width: 900px)')
  const pinned = wideEnough && !reducedMotion

  /** How far the track slides sideways, in px. */
  const [travel, setTravel] = useState(0)
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState(false)

  /** Left edge + width of each card, in track coordinates. */
  const cardBoxesRef = useRef<{ left: number; width: number }[]>([])

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>('[data-card]'),
    )
    cardBoxesRef.current = cards.map((c) => ({
      left: c.offsetLeft,
      width: c.offsetWidth,
    }))

    if (!pinned) {
      setTravel(0)
      return
    }
    setTravel(Math.max(0, track.offsetWidth - window.innerWidth))
  }, [pinned])

  useLayoutEffect(() => {
    measure()
    if (!trackRef.current) return
    // Fonts and images change card widths after first paint.
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  /** Applies transform + rail state for a given 0–1 progress. */
  const apply = useCallback(
    (progress: number) => {
      const track = trackRef.current
      if (!track) return

      const x = -progress * travel
      track.style.setProperty('--track-x', `${x}px`)

      /* The card you're "on" is whichever fills the most screen. A fixed
         reading anchor gets this wrong at both ends of the strip, where one
         card is clamped against the edge. */
      const boxes = cardBoxesRef.current
      if (boxes.length) {
        let winner = 0
        let mostVisible = -1
        boxes.forEach((b, i) => {
          const left = b.left + x
          const visible =
            Math.min(left + b.width, window.innerWidth) - Math.max(left, 0)
          // >= so a later card wins ties, matching reading direction.
          if (visible >= mostVisible) {
            mostVisible = visible
            winner = i
          }
        })
        setActive((prev) => (prev === winner ? prev : winner))
      }

      setStarted(progress > 0.03)
      onProgress?.(progress)
    },
    [travel, onProgress],
  )

  useEffect(() => {
    onActiveChange?.(active)
  }, [active, onActiveChange])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    if (!pinned) {
      track.style.removeProperty('--track-x')
      setActive(0)
      onProgress?.(0)
      return
    }

    /* Read straight off the scroll event. The browser already coalesces
       scroll to one dispatch per frame, and this is a single rect read plus
       a custom-property write — cheap enough not to need an rAF gate, and
       it keeps working when rAF is throttled. */
    const read = () => {
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      apply(clamp01(-section.getBoundingClientRect().top / scrollable))
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [pinned, apply, onProgress])

  /** Scroll position (px) that brings card `index` as close to centre as the
      strip allows. Centring (rather than flush-left) is what keeps the last
      two dots distinct — late cards can never reach the left gutter. */
  const scrollTopForCard = useCallback(
    (index: number) => {
      const section = sectionRef.current
      const box = cardBoxesRef.current[index]
      if (!section || !box || travel <= 0) return null

      const cardCentre = box.left + box.width / 2
      const wantedX = Math.max(
        -travel,
        Math.min(0, window.innerWidth / 2 - cardCentre),
      )
      const progress = clamp01(-wantedX / travel)
      const scrollable = section.offsetHeight - window.innerHeight
      return section.offsetTop + progress * scrollable
    },
    [travel],
  )

  const goToCard = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const top = scrollTopForCard(index)
      if (top === null) return
      window.scrollTo({ top, behavior })
    },
    [scrollTopForCard],
  )

  /* Keyboard order must match visual order: when a card takes focus by Tab,
     bring it into view ourselves. Otherwise the browser scrolls the sticky
     container sideways and the transform fights it. */
  useEffect(() => {
    const track = trackRef.current
    const sticky = stickyRef.current
    if (!track || !sticky || !pinned) return

    const onFocusIn = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-card]')
      if (!card) return
      const index = Array.from(
        track.querySelectorAll<HTMLElement>('[data-card]'),
      ).indexOf(card)
      if (index >= 0) goToCard(index, 'auto')
    }
    // Undo any sideways scroll the browser applied to the clipping box.
    const onSidewaysScroll = () => {
      if (sticky.scrollLeft !== 0) sticky.scrollLeft = 0
    }

    track.addEventListener('focusin', onFocusIn)
    sticky.addEventListener('scroll', onSidewaysScroll)
    return () => {
      track.removeEventListener('focusin', onFocusIn)
      sticky.removeEventListener('scroll', onSidewaysScroll)
    }
  }, [pinned, goToCard])

  const onRailKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = Math.max(0, Math.min(projects.length - 1, index + delta))
    goToCard(next, reducedMotion ? 'auto' : 'smooth')
    const rail = e.currentTarget.parentElement
    rail?.querySelectorAll('button')[next]?.focus()
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work"
      data-mode={pinned ? 'pinned' : 'static'}
      style={{ '--scroll-distance': `${travel * PIN_STRETCH}px` } as React.CSSProperties}
      aria-labelledby="work-heading"
    >
      <h2 id="work-heading" className="work__heading">
        Selected work
      </h2>

      <div className="work__sticky" ref={stickyRef}>
        <div className="work__track" ref={trackRef}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>

        <p className="hint" style={{ opacity: started ? 0 : 1 }}>
          Scroll to explore work
        </p>

        <div className="rail" role="group" aria-label="Jump to project">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              className="rail__dot"
              style={{ '--dot-accent': project.accent } as React.CSSProperties}
              aria-current={active === i}
              onClick={() => goToCard(i, reducedMotion ? 'auto' : 'smooth')}
              onKeyDown={(e) => onRailKeyDown(e, i)}
            >
              <span className="visually-hidden">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
