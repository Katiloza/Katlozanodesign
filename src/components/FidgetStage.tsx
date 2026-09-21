import { useEffect, useRef, useState } from 'react'
import { BrowserWindow, LabelCard } from './BrowserWindow'
import { CardPhysics } from '@/lib/cardPhysics'
import type { Project } from '@/data/projects'

/* Fidget mode drops the two case studies onto the dot grid and then hands
   them to the physics sim, so they can be picked up and thrown. Every
   number below is in stage coordinates: the stage is 1295×924, inset
   24px from the top of the work area and 42px from the left. */
export const FIDGET_W = 1295
export const FIDGET_H = 924

/** Time for the CSS drop-in to land before the simulation takes over. */
const DROP_SETTLE_MS = 1180
const GRAVITY = 0.4

type Spot = {
  x: number
  y: number
  w: number
  h: number
  z: number
  /** Which drop keyframe, and how the fall is staged. */
  drop: { name: 'sm' | 'md' | 'lg'; duration: number; delay: number }
  browser: { x: number; y: number; w: number; h: number; opacity?: number }
  label: { x: number; y: number; w: number }
}

const cardSpots: Record<string, Spot> = {
  tokens: {
    x: 0,
    y: 571,
    w: 506.57,
    h: 353.1,
    z: 3,
    drop: { name: 'md', duration: 880, delay: 0 },
    browser: { x: -30, y: 89, w: 486.3, h: 275.9 },
    label: { x: 65, y: 20, w: 376 },
  },
  mcrpc: {
    x: 815,
    y: 362.8,
    w: 480,
    h: 549,
    z: 5,
    drop: { name: 'lg', duration: 980, delay: 140 },
    browser: { x: -5, y: 156, w: 490, h: 661, opacity: 0.94 },
    label: { x: 52, y: 80, w: 376 },
  },
}

function backgroundStyle(p: Project) {
  return {
    backgroundImage: `url(${p.fidgetBackground.image})`,
    backgroundSize: p.fidgetBackground.size ?? 'cover',
    backgroundPosition: p.fidgetBackground.position ?? 'center',
  }
}

export function FidgetStage({
  projects,
  /** The board's CSS scale, so pointer grabs land on the card. */
  scale = 1,
}: {
  projects: Project[]
  scale?: number
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const placed = projects.filter((p) => cardSpots[p.id])

  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  // Read through a ref so the sim always sees the live scale without
  // needing to be torn down and rebuilt on every resize.
  const scaleRef = useRef(scale)
  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    // Reduced motion collapses the drop-in to ~0ms, so don't leave the
    // cards looking grabbable but inert for a second first.
    const settle = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : DROP_SETTLE_MS

    let sim: CardPhysics | null = null
    const timer = window.setTimeout(() => {
      const els = placed
        .map((p) => cardRefs.current[p.id])
        .filter((el): el is HTMLDivElement => Boolean(el))
      if (els.length) {
        sim = new CardPhysics(stage, els, {
          gravity: GRAVITY,
          getScale: () => scaleRef.current,
        })
      }
    }, settle)

    return () => {
      window.clearTimeout(timer)
      sim?.destroy()
    }
    // Rebuilt only when the set of cards changes — not on hover or resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed.map((p) => p.id).join(',')])

  return (
    <div
      ref={stageRef}
      data-screen-label="Fidget mode"
      className="relative"
      style={{
        width: FIDGET_W,
        height: FIDGET_H,
        margin: '24px 0 0 42px',
        animation: 'mode-in 420ms ease-in both',
      }}
    >
      {/* Hovering a card washes everything else out. */}
      <div
        className="pointer-events-none absolute"
        style={{ left: -14, top: 41, width: 1389, height: 883, zIndex: 20 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(255,255,255,.58)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 800ms ease-in',
          }}
        />
      </div>

      {placed.map((p) => {
        const s = cardSpots[p.id]
        const lifted = hovered === p.id
        return (
          <div
            key={p.id}
            ref={(el) => {
              cardRefs.current[p.id] = el
            }}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(p.id)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            /* TODO: once case-study routes exist, make this an <a href> so
               the "View Case Study" caption is actually actionable. Until
               then it is a focusable group, not a link, so assistive tech
               is not promised navigation that does not happen. */
            role="group"
            aria-label={p.title}
            className="absolute cursor-grab select-none rounded-[56px] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink active:cursor-grabbing"
            style={{
              left: s.x,
              top: s.y,
              width: s.w,
              height: s.h,
              zIndex: lifted ? 30 : s.z,
              // Cards claim the gesture so a drag throws instead of scrolling.
              touchAction: 'none',
              animation: `fidget-drop-${s.drop.name} ${s.drop.duration}ms cubic-bezier(.12,.66,.16,1) ${s.drop.delay}ms both`,
            }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[56px]"
              style={backgroundStyle(p)}
            >
              <BrowserWindow
                url={p.url}
                screenshot={p.screenshot}
                alt={p.title}
                chromeWidth={320}
                opacity={s.browser.opacity}
                style={{
                  position: 'absolute',
                  left: s.browser.x,
                  top: s.browser.y,
                  width: s.browser.w,
                  height: s.browser.h,
                }}
              />
            </div>

            <div
              className="pointer-events-none absolute"
              style={{ left: s.label.x, top: s.label.y, width: s.label.w }}
            >
              <LabelCard
                title={p.title}
                color={p.labelColor}
                blur={32}
                style={{ opacity: lifted ? 1 : 0, transition: 'opacity 300ms ease-in' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
