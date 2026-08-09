import { projects } from '@/content/projects'

type Props = {
  scrolled: boolean
  /** Which section the reader is in — the bar's job is to say where you are. */
  section: 'intro' | 'work'
  activeProject: number
}

export function Nav({ scrolled, section, activeProject }: Props) {
  const here =
    section === 'work'
      ? `Work — ${String(activeProject + 1).padStart(2, '0')} / ${String(
          projects.length,
        ).padStart(2, '0')}`
      : 'Intro'

  return (
    <header className="nav" data-scrolled={scrolled}>
      <a className="nav__wordmark" href="/" aria-label="Kat Lozano, home">
        Kat Lozano.
      </a>

      <div className="nav__center">
        <p
          className="nav__here"
          data-active={section}
          style={
            {
              '--accent': projects[activeProject]?.accent,
            } as React.CSSProperties
          }
          aria-live="polite"
        >
          {here}
        </p>
        <span className="nav__status">
          <span aria-hidden="true">🚧</span>
          <span>under construction</span>
        </span>
      </div>

      <a className="nav__connect" href="mailto:kalozan1@asu.edu">
        Connect
      </a>
    </header>
  )
}
