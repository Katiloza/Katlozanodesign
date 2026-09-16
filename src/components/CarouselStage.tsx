import { LabelCard, BrowserWindow } from './BrowserWindow'
import type { Project } from '@/data/projects'

/* Stage geometry, in design px, measured off the Figma exports.
   The frame is 1440 wide; the stage runs x 64 → 1404. */
export const STAGE_W = 1340
export const STAGE_H = 781

const CARD_W = 1188
const SPINE_L = 96
const SPINE_R = 128

/** Browser size differs per case study — frame 1-5 vs frame 1-126. */
const frameSize: Record<string, { w: number; h: number }> = {
  mcrpc: { w: 814, h: 655 },
  tokens: { w: 976, h: 618 },
  'design-system': { w: 976, h: 618 },
}

/**
 * Cards carry their backdrop at full card size. A spine is the same
 * backdrop clipped to a sliver, so it anchors to whichever edge of the
 * card is the one still on screen.
 */
function backgroundStyle(p: Project, anchor: 'center' | 'left top' | 'right top' = 'center') {
  if (!('image' in p.background)) return { background: p.background.css }
  return {
    backgroundImage: `url(${p.background.image})`,
    backgroundSize: anchor === 'center' ? 'cover' : `${CARD_W}px ${STAGE_H}px`,
    backgroundPosition: anchor,
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
  const active = projects[index]
  const next = projects[index + 1]
  const prev = projects[index - 1]

  // One neighbour peeks at a time: the next card when there is one,
  // otherwise the previous — which is what makes frame 1-126 (peek right)
  // and frame 1-5 (peek left, last card) the same layout.
  const peekRight = Boolean(next)
  const cardX = peekRight ? 0 : STAGE_W - CARD_W

  const size = frameSize[active.id] ?? frameSize['design-system']

  return (
    <div className="relative" style={{ marginLeft: 64, width: STAGE_W, height: STAGE_H }}>
      {!peekRight && prev && (
        <Spine
          project={prev}
          side="left"
          onClick={() => onIndex(index - 1)}
          style={{ left: 0, top: 1, width: SPINE_L, height: STAGE_H - 2 }}
        />
      )}

      {peekRight && next && (
        <Spine
          project={next}
          side="right"
          onClick={() => onIndex(index + 1)}
          style={{ left: STAGE_W - SPINE_R, top: 0, width: SPINE_R, height: STAGE_H }}
        />
      )}

      {/* Active card */}
      <div
        className="absolute overflow-hidden rounded-[56px]"
        style={{ left: cardX, top: 0, width: CARD_W, height: STAGE_H, ...backgroundStyle(active) }}
      >
        <BrowserWindow
          url={active.url}
          screenshot={active.screenshot}
          alt={active.title}
          chromeWidth={320}
          style={{
            position: 'absolute',
            left: (CARD_W - size.w) / 2,
            top: 120,
            width: size.w,
            height: size.h,
          }}
        />
      </div>

      {/* Card-relative (366, 18) in frame 1-5 and (385, 24) in 1-126 —
          left-aligned, not centred on the card. */}
      <LabelCard
        title={active.title}
        color={active.labelColor}
        style={{ position: 'absolute', left: cardX + 372, top: 20, maxWidth: 400 }}
      />
    </div>
  )
}

/** A neighbouring card clipped to a sliver, title running up its edge. */
function Spine({
  project,
  side,
  style,
  onClick,
}: {
  project: Project
  side: 'left' | 'right'
  style: React.CSSProperties
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to ${project.spineTitle}`}
      className="absolute overflow-hidden rounded-[20px]"
      style={{ ...style, ...backgroundStyle(project, side === 'left' ? 'right top' : 'left top') }}
    >
      <span
        className="absolute left-1/2 top-1/2 block text-center text-3xl font-bold leading-8"
        style={{
          color: project.spineColor,
          width: STAGE_H - 40,
          transform: `translate(-50%, -50%) rotate(${side === 'left' ? -90 : 90}deg)`,
        }}
      >
        {project.spineTitle}
      </span>
    </button>
  )
}
