import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { BrowserWindow, LabelCard } from './BrowserWindow'
import type { Project } from '@/data/projects'

/* The carousel is two cards sharing a fixed row. The active one expands
   and shows its browser window; its neighbour collapses to a strip with
   the title running up the edge. Geometry is in design px — the row runs
   x 79 → 1404 on the 1440 artboard.

   The collapsed strip is the control — it is what you hover, click or
   Enter to bring a case study forward — so it is the button and the
   expanded card is just labelled content. Left/Right/Home/End also walk
   the row, and preventDefault only fires when a key is actually consumed
   so the page can still be scrolled from here. */
export const STAGE_W = 1325
export const STAGE_H = 781

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const STRIP_W = 141
/** Collapsed strip + the 8px gap, taken out of the active card's width. */
const STRIP_GUTTER = 149

type Inner =
  | {
      /** Browser centred under a fixed top inset (the token card). */
      layout: 'centered'
      top: number
      w: number
      h: number
      caption: { x: number; y: number }
      fadeDots?: boolean
    }
  | {
      /** Browser pinned to an absolute spot (the cancer card). */
      layout: 'absolute'
      x: number
      y: number
      w: number
      h: number
      caption: { x: number; y: number }
      fadeDots?: boolean
    }

const inner: Record<string, Inner> = {
  tokens: {
    layout: 'centered',
    top: 80,
    w: 976,
    h: 618,
    caption: { x: 442, y: 24 },
    fadeDots: true,
  },
  mcrpc: {
    layout: 'absolute',
    x: 194,
    y: 121,
    w: 809,
    h: 651,
    caption: { x: 460, y: 18 },
  },
}

const fallbackInner: Inner = {
  layout: 'centered',
  top: 80,
  w: 976,
  h: 618,
  caption: { x: 442, y: 24 },
}

/**
 * An expanded card takes the row minus one collapsed strip. With more than
 * two cards this needs to subtract one gutter per collapsed neighbour.
 */
function activeWidth(count: number) {
  return `calc(100% - ${STRIP_GUTTER * Math.max(1, count - 1)}px)`
}

function cardStyle(active: boolean, count: number): CSSProperties {
  return {
    position: 'relative',
    height: '100%',
    flexShrink: 0,
    overflow: 'hidden',
    // Only the collapsed strip is clickable, so only it gets the affordance.
    cursor: active ? 'default' : 'pointer',
    width: active ? activeWidth(count) : `${STRIP_W}px`,
    borderRadius: active ? 56 : 20,
    transition: `width 800ms ${EASE}, border-radius 800ms ${EASE}`,
  }
}

/* Collapsed, the strip shows the painting's left column (sky + palm) at
   1:1; expanded, the card centres it so the browser lands back over the
   window already in the artwork. The -60px skips the artwork's own baked
   rounded corner, so the strip reads as a clean 20px radius rather than a
   doubled one. */
function plateStyle(active: boolean): CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: active ? 'center' : '-60px center',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    opacity: active ? 1 : 0.83,
    transition: `opacity 800ms ${EASE}`,
  }
}

export function CarouselStage({
  projects,
  index,
  onIndex,
}: {
  projects: Project[]
  index: number
  onIndex: (i: number) => void
}) {
  const [shotHover, setShotHover] = useState<string | null>(null)
  // Alternating the keyframe name is what restarts the slide each switch.
  // It is set in the same handler as the index so both land in one render;
  // deriving it in an effect would play the previous direction first and
  // then remount the subtree.
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right')
  const cards = useRef<(HTMLDivElement | null)[]>([])
  /** Set when a switch came from the keyboard, so focus can follow it. */
  const refocus = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (refocus.current !== null) {
      cards.current[refocus.current]?.focus()
      refocus.current = null
    }
  }, [index])

  const pick = (i: number, fromKeyboard = false) => {
    if (i === index || i < 0 || i >= projects.length) return
    setAnimDir(i < index ? 'left' : 'right')
    setShotHover(null)
    /*
     * The card being selected expands and loses its tabIndex, so focus
     * would fall to <body> and arrow keys would stop reaching this group.
     * Hand focus to whichever card collapses in its place — including when
     * the mouse triggered the switch, if the expanding card held focus.
     */
    if (fromKeyboard || cards.current[i]?.contains(document.activeElement)) {
      refocus.current = index
    }
    onIndex(i)
  }

  /*
   * Left/Right only, and preventDefault only when the key is actually
   * consumed: claiming Up/Down would stop the page scrolling whenever a
   * card had focus.
   */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = projects.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = Math.min(last, index + 1)
    else if (e.key === 'ArrowLeft') next = Math.max(0, index - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null || next === index) return
    e.preventDefault()
    pick(next, true)
  }

  return (
    <div
      data-screen-label="Carousel"
      role="group"
      aria-label="Featured work"
      onKeyDown={onKeyDown}
      className="flex overflow-visible"
      style={{
        gap: 8,
        width: STAGE_W,
        height: STAGE_H,
        margin: '25px 0 0 79px',
        animation: 'mode-in 420ms ease-in both',
      }}
    >
      {projects.map((p, i) => {
        const active = i === index
        const cfg = inner[p.id] ?? fallbackInner
        const hovered = shotHover === p.id

        return (
          <div
            key={p.id}
            ref={(el) => {
              cards.current[i] = el
            }}
            /* The collapsed strip is the control — it is what you click to
               bring a case study forward. The expanded card is just the
               content, so it carries no role of its own. */
            {...(active
              ? { role: 'group' as const, 'aria-label': p.title }
              : {
                  role: 'button',
                  tabIndex: 0,
                  // Matches the visible spine text, so voice control can
                  // activate it by the name on screen.
                  'aria-label': `Show ${p.spineTitle}`,
                  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    e.stopPropagation()
                    pick(i, true)
                  },
                })}
            onMouseEnter={() => pick(i)}
            onClick={() => pick(i)}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            style={cardStyle(active, projects.length)}
          >
            {'image' in p.background ? (
              <img src={p.background.image} alt="" draggable={false} style={plateStyle(active)} />
            ) : (
              <span
                aria-hidden="true"
                style={{ ...plateStyle(active), background: p.background.css }}
              />
            )}

            {active && (
              <div
                key={`${index}-${animDir}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  overflow: 'hidden',
                  animation: `slide-from-${animDir} 800ms ${EASE} both`,
                }}
              >
                {cfg.layout === 'centered' ? (
                  <div
                    className="flex size-full flex-col items-center"
                    style={{ paddingTop: cfg.top }}
                  >
                    <BrowserWindow
                      url={p.url}
                      screenshot={p.screenshot}
                      alt={p.title}
                      chromeWidth={320}
                      dotsOpacity={cfg.fadeDots ? (hovered ? 1 : 0) : undefined}
                      onShotEnter={() => setShotHover(p.id)}
                      onShotLeave={() => setShotHover(null)}
                      className="relative shrink-0"
                      style={{ width: cfg.w, height: cfg.h }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <BrowserWindow
                      url={p.url}
                      screenshot={p.screenshot}
                      alt={p.title}
                      chromeWidth={320}
                      dotsOpacity={cfg.fadeDots ? (hovered ? 1 : 0) : undefined}
                      onShotEnter={() => setShotHover(p.id)}
                      onShotLeave={() => setShotHover(null)}
                      style={{
                        position: 'absolute',
                        left: cfg.x,
                        top: cfg.y,
                        width: cfg.w,
                        height: cfg.h,
                      }}
                    />
                  </div>
                )}

                <div
                  className="pointer-events-none absolute"
                  style={{ left: cfg.caption.x, top: cfg.caption.y }}
                >
                  <LabelCard
                    title={p.title}
                    color={p.carouselLabelColor}
                    blur={16}
                    nowrap
                    style={{ opacity: hovered ? 1 : 0, transition: 'opacity 300ms ease-in' }}
                  />
                </div>
              </div>
            )}

            {!active && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  containerType: 'size',
                  animation: 'strip-label-appear 380ms ease 360ms both',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    flex: 'none',
                    width: '100cqh',
                    height: '100cqw',
                    transform: 'rotate(-90deg)',
                  }}
                >
                  <p
                    className="m-0 px-4 text-center text-[30px] font-bold leading-[1.1]"
                    style={{ color: p.spineColor, wordBreak: 'break-word' }}
                  >
                    {p.spineTitle}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
