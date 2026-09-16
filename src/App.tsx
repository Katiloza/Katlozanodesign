import { useEffect, useRef, useState } from 'react'
import { Footer, Masthead, Nav, ViewBar, type Mode, type Page } from '@/components/Chrome'
import { CarouselStage } from '@/components/CarouselStage'
import { FidgetStage } from '@/components/FidgetStage'
import { AboutPage } from '@/components/AboutPage'
import { projects } from '@/data/projects'

/* The Figma artboard is 1440 wide and every block sits at a fixed y —
   nav 0, masthead 111, view bar 278, stage 402, footer 1298 — in all
   five frames. Laying the page out absolutely at those coordinates and
   scaling the whole board is what keeps it on the design. */
const DESIGN_W = 1440
const DESIGN_H = 1570

export default function App() {
  const [page, setPage] = useState<Page>('work')
  const [mode, setMode] = useState<Mode>('carousel')
  const [index, setIndex] = useState(1)

  const scale = useDesignScale()
  const boardRef = useRef<HTMLDivElement>(null)
  const [boardHeight, setBoardHeight] = useState(DESIGN_H)

  useEffect(() => {
    if (!boardRef.current) return
    const ro = new ResizeObserver(() => {
      setBoardHeight(boardRef.current?.scrollHeight ?? DESIGN_H)
    })
    ro.observe(boardRef.current)
    return () => ro.disconnect()
  }, [page, mode])

  // Arrow keys walk the carousel.
  useEffect(() => {
    if (page !== 'work' || mode !== 'carousel') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(projects.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, mode])

  return (
    <div id="top" className="dot-grid min-h-screen overflow-x-hidden bg-white">
      <div style={{ height: boardHeight * scale }}>
        <div
          ref={boardRef}
          className="relative origin-top-left"
          style={{ width: DESIGN_W, minHeight: DESIGN_H, transform: `scale(${scale})` }}
        >
          <Nav />
          <Masthead />
          <ViewBar page={page} onPage={setPage} mode={mode} onMode={setMode} />

          {page === 'work' ? (
            <div className="absolute inset-x-0 top-[402px]">
              {mode === 'carousel' ? (
                <CarouselStage projects={projects} index={index} onIndex={setIndex} />
              ) : (
                <FidgetStage projects={projects} />
              )}
            </div>
          ) : (
            <div className="absolute inset-x-0 top-[349px]">
              <AboutPage />
            </div>
          )}

          <Footer onPage={setPage} />
        </div>
      </div>
    </div>
  )
}

/** Scales the fixed 1440 artboard down to fit narrower viewports. */
function useDesignScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const measure = () => setScale(Math.min(1, window.innerWidth / DESIGN_W))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return scale
}
