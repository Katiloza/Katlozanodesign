import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Footer, Masthead, Nav, ViewBar, type Mode, type Page } from '@/components/Chrome'
import { CarouselStage } from '@/components/CarouselStage'
import { FidgetStage } from '@/components/FidgetStage'
import { AboutPage } from '@/components/AboutPage'
import { featured } from '@/data/projects'

/* The design is drawn on a 1440-wide artboard. The board keeps that width
   and is scaled down to fit narrower viewports; the wrapper is given the
   scaled height so the page scrolls to the right length. Blocks inside
   stack in normal flow, so the footer follows the tallest view.
   Scale never exceeds 1 (the board doesn't blow up past its native size
   on very wide screens), so once the viewport is wider than the board
   there's leftover width; that gets split evenly as margin so the board
   sits centered instead of pinned to the left edge. */
const DESIGN_W = 1440
const DESIGN_H = 1570

export default function App() {
  const [page, setPage] = useState<Page>('work')
  const [mode, setMode] = useState<Mode>('carousel')
  const [index, setIndex] = useState(featured.length > 1 ? 1 : 0)

  const boardRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [boardHeight, setBoardHeight] = useState(DESIGN_H)
  const [offsetX, setOffsetX] = useState(0)

  /*
   * Width comes from the document element, not from the wrapper: the
   * wrapper's own width depends on whether a scrollbar is showing, which
   * depends on the height this scale produces. Reading the viewport
   * directly keeps that out of the loop. Both setters bail on no-op
   * updates so the ResizeObserver can't retrigger itself indefinitely.
   */
  const measure = useCallback(() => {
    const vw = document.documentElement.clientWidth
    const next = Math.min(1, vw / DESIGN_W)
    setScale((cur) => (Math.abs(cur - next) < 0.0005 ? cur : next))

    const nextOffset = Math.max(0, (vw - DESIGN_W * next) / 2)
    setOffsetX((cur) => (Math.abs(cur - nextOffset) < 0.5 ? cur : nextOffset))

    const board = boardRef.current
    if (board) {
      const h = board.scrollHeight
      setBoardHeight((cur) => (Math.abs(cur - h) < 1 ? cur : h))
    }
  }, [])

  // Re-measure after the view swaps, before paint, so the wrapper height
  // never lags a frame behind the content.
  useLayoutEffect(measure, [measure, page, mode, index])

  useEffect(() => {
    const board = boardRef.current
    const ro = new ResizeObserver(measure)
    if (board) ro.observe(board)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <div id="top" className="dot-grid min-h-screen overflow-x-hidden bg-white">
      <div style={{ height: Math.round(boardHeight * scale) }}>
        <div
          ref={boardRef}
          className="relative origin-top-left"
          style={{ width: DESIGN_W, marginLeft: offsetX, transform: `scale(${scale})` }}
        >
          <Nav />
          <Masthead />
          <ViewBar page={page} onPage={setPage} mode={mode} onMode={setMode} />

          {page === 'work' ? (
            mode === 'carousel' ? (
              <CarouselStage projects={featured} index={index} onIndex={setIndex} />
            ) : (
              <FidgetStage projects={featured} scale={scale} />
            )
          ) : (
            <AboutPage />
          )}

          <Footer onPage={setPage} />
        </div>
      </div>
    </div>
  )
}
