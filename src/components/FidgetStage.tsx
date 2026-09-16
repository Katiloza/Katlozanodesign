import { useState } from 'react'
import { BrowserWindow, LabelCard } from './BrowserWindow'
import type { Project } from '@/data/projects'
import fidgetA from '@/assets/work/fidget-a.png'
import fidgetB from '@/assets/work/fidget-b.png'
import fidgetC from '@/assets/work/fidget-c.png'

/* Fidget mode scatters the work across the page with the desk toys.
   Every number below is measured off frame 1-247, in frame coordinates
   (the 1440-wide artboard), with the stage starting at y 401. */
export const FIDGET_W = 1440
export const FIDGET_H = 924

const ORIGIN_Y = 401

const toys = [
  { src: fidgetA, x: 91, y: 531, w: 300, h: 310, z: 1, alt: 'Pressed-button fidget toy' },
  { src: fidgetB, x: 428, y: 401, w: 612, h: 572, z: 2, alt: 'Keycap fidget toy' },
  { src: fidgetC, x: 571, y: 930, w: 278, h: 282, z: 4, alt: 'Second button fidget toy' },
]

/** Where each case study lands on the desk. */
const cardSpots: Record<string, { x: number; y: number; w: number; h: number; z: number; browser: { x: number; y: number; w: number; h: number } }> = {
  tokens: {
    x: 42,
    y: 921,
    w: 506,
    h: 352,
    z: 3,
    browser: { x: 0, y: 90, w: 500, h: 263 },
  },
  mcrpc: {
    x: 857,
    y: 764,
    w: 480,
    h: 549,
    z: 5,
    browser: { x: -5, y: 80, w: 490, h: 560 },
  },
}

function backgroundStyle(p: Project) {
  return 'image' in p.background
    ? { backgroundImage: `url(${p.background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: p.background.css }
}

export function FidgetStage({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const placed = projects.filter((p) => cardSpots[p.id])

  return (
    <div className="relative" style={{ width: FIDGET_W, height: FIDGET_H }}>
      {toys.map((t) => (
        <img
          key={t.src}
          src={t.src}
          alt={t.alt}
          className="pointer-events-none absolute select-none"
          style={{ left: t.x, top: t.y - ORIGIN_Y, width: t.w, height: t.h, zIndex: t.z }}
        />
      ))}

      {/* Frame 7-19: hovering a card washes everything else out. */}
      {hovered && (
        <div
          className="pointer-events-none absolute bg-white/60 transition-opacity"
          style={{ left: 28, top: 430 - ORIGIN_Y, width: 1389, height: 883, zIndex: 20 }}
        />
      )}

      {placed.map((p) => {
        const s = cardSpots[p.id]
        const lifted = hovered === p.id
        return (
          <div
            key={p.id}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(p.id)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            role="link"
            aria-label={p.title}
            className="absolute cursor-pointer rounded-[56px] outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
            style={{
              left: s.x,
              top: s.y - ORIGIN_Y,
              width: s.w,
              height: s.h,
              zIndex: lifted ? 30 : s.z,
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
                chromeWidth={200}
                style={{
                  position: 'absolute',
                  left: s.browser.x,
                  top: s.browser.y,
                  width: s.browser.w,
                  height: s.browser.h,
                }}
              />
            </div>

            {lifted && (
              <LabelCard
                title={p.title}
                color={p.labelColor}
                /* Frame 7-19 puts it at (914, 810) — card-relative (57, 46). */
                style={{ position: 'absolute', left: 57, top: 46, width: 386 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
