import { useCallback, useEffect, useState } from 'react'
import { Nav } from '@/components/Nav'
import { WorkStrip } from '@/components/WorkStrip'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [section, setSection] = useState<'intro' | 'work'>('intro')
  const [activeProject, setActiveProject] = useState(0)

  /* One scroll listener drives both the bar's shadow and its wayfinding.
     The strip counts as "here" once its top clears the bar — in pinned mode
     that's the moment it takes over the viewport, and in the static fallback
     it's the moment the first card reaches the top. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const work = document.getElementById('work')
      const barHeight = 96
      setSection(
        work && work.getBoundingClientRect().top <= barHeight ? 'work' : 'intro',
      )
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const handleActiveChange = useCallback(
    (index: number) => setActiveProject(index),
    [],
  )

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>

      <Nav scrolled={scrolled} section={section} activeProject={activeProject} />

      <main id="main">
        <section className="hero" aria-labelledby="hero-line">
          <h1 className="hero__line" id="hero-line">
            hi, i design and build systems that empower the people who matter.
          </h1>
          <p className="hero__meta">
            <span>UX researcher &amp; product designer</span>
            <span>Mesa, Arizona</span>
          </p>
        </section>

        <WorkStrip onActiveChange={handleActiveChange} />
      </main>
    </>
  )
}
