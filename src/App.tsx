import { useEffect, useRef, useState, useCallback } from 'react'
import workCards from '@/assets/work-card-container.svg'

/**
 * The strip is the flat SVG export of the work-card container — the layout
 * source of truth. The generated `@/imports/Container` component is still in
 * the repo but no longer rendered: its flex row added a 32px gap the design
 * doesn't have, which is what made the cards sit unevenly.
 */
const STRIP_WIDTH = 4502
const STRIP_HEIGHT = 783

const CARD_COUNT = 5
const DOT_COLORS = ['#c008b1', '#0d0d0d', '#93928d', '#0d0d0d', '#422b2a']

export default function App() {
  const scrollSectionRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [maxTranslate, setMaxTranslate] = useState(0)

  const updateMaxTranslate = useCallback(() => {
    if (!stripRef.current) return
    const stripWidth = stripRef.current.getBoundingClientRect().width
    setMaxTranslate(Math.max(0, stripWidth - window.innerWidth))
  }, [])

  useEffect(() => {
    // Small delay to let the import render its full width
    const t = setTimeout(updateMaxTranslate, 100)
    window.addEventListener('resize', updateMaxTranslate)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateMaxTranslate)
    }
  }, [updateMaxTranslate])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollSectionRef.current) return
      const el = scrollSectionRef.current
      const rect = el.getBoundingClientRect()
      const totalScrollable = el.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeDot = Math.round(scrollProgress * (CARD_COUNT - 1))
  const translateX = -(scrollProgress * maxTranslate)

  return (
    <div style={{ backgroundColor: '#faf8f4', minHeight: '100vh' }}>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '36px 48px 26px',
          backgroundColor: 'rgba(250,248,244,0.92)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontWeight: 700,
            fontSize: '36px',
            color: '#422b2a',
            letterSpacing: '-0.36px',
            lineHeight: 1,
          }}
        >
          Kat Lozano.
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(66,43,42,0.08)',
            border: '1px solid rgba(66,43,42,0.15)',
            color: '#422b2a',
            padding: '5px 10px',
            borderRadius: '6px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.02em',
          }}
        >
          <span>🚧</span>
          <span>under construction</span>
        </div>
        <a
          href="#connect"
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontWeight: 400,
            fontSize: '24px',
            color: '#422b2a',
            letterSpacing: '-0.24px',
            lineHeight: 1,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Connect
        </a>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '154px',
          paddingLeft: '48px',
          paddingRight: '52px',
          paddingBottom: '0',
        }}
      >
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(26px, 2.8vw, 40px)',
            lineHeight: 1.03,
            color: '#422b2a',
            letterSpacing: '-1.03px',
            maxWidth: '960px',
            margin: 0,
          }}
        >
          hi, i design and build systems that empower the people who matter.
        </p>
      </section>

      {/* ── Horizontal Parallax Scroll ───────────────────────────── */}
      <div
        ref={scrollSectionRef}
        style={{ height: '450vh', position: 'relative', marginTop: '8px' }}
      >
        {/* Sticky viewport panel */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* Sliding track — the SVG's own 4502×783 box sets the width, so
              the cards keep the exact spacing they have in the export. */}
          <div
            ref={stripRef}
            style={{
              transform: `translateX(${translateX}px)`,
              willChange: 'transform',
              width: `${STRIP_WIDTH}px`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              height: `${STRIP_HEIGHT}px`,
            }}
          >
            <img
              src={workCards}
              width={STRIP_WIDTH}
              height={STRIP_HEIGHT}
              alt="Selected work: Living Interactive Evidence Synthesis for Mayo Clinic, EdPlus course design standards, and the Sensee app."
              style={{ display: 'block', flexShrink: 0 }}
            />
          </div>

          {/* Progress dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: activeDot === i ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: activeDot === i ? DOT_COLORS[i] : 'rgba(66,43,42,0.2)',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '72px',
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: scrollProgress > 0.04 ? 0 : 1,
              transition: 'opacity 0.5s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                color: 'rgba(66,43,42,0.45)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              scroll to explore work
            </p>
          </div>
        </div>
      </div>

      {/* ── Connect anchor ─────────────────────────────────────────── */}
      <div id="connect" style={{ height: '1px' }} />
    </div>
  )
}
