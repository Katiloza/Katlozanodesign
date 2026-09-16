import type { ReactNode } from 'react'
import { CarouselIcon, FidgetIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from './icons'

export type Page = 'work' | 'about'
export type Mode = 'carousel' | 'fidget'

/* ── Nav ────────────────────────────────────────────────────────────
   Frame: 1440×112, pl 56 / pr 44 / pt 36. Logo left, status chip right. */
export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 h-28">
      <a
        href="#top"
        className="absolute left-14 top-9 font-script text-[60px] font-bold leading-10 text-ink"
        aria-label="Kat Lozano — home"
      >
        K
      </a>

      <div className="absolute right-11 top-10">
        <span className="flex items-center gap-1 rounded-full bg-live-bg py-0.5 pl-1.5 pr-2.5">
          <span className="flex size-4 items-center justify-center">
            <span className="size-2 rounded-full bg-live" />
          </span>
          <span className="text-base leading-6 tracking-tight text-live">
            Working on something cool? Let&rsquo;s{' '}
            <a href="mailto:kalozan1@asu.edu" className="font-semibold underline">
              connect!
            </a>
          </span>
        </span>
      </div>
    </header>
  )
}

/* ── Masthead ───────────────────────────────────────────────────────
   Name + the two-line positioning statement. */
export function Masthead() {
  return (
    <div className="absolute inset-x-0 top-[111px] px-16 pt-7">
      <h1 className="text-4xl font-medium leading-[54px] tracking-wide text-ink">Kat Lozano</h1>
      <p className="pt-1 text-2xl leading-6 text-ink">
        &ldquo;I design to empower the people who matter.&rdquo;
      </p>
      <p className="text-2xl leading-7 tracking-wide text-muted">
        Previously worked for EdPlus, Mayo Clinic, and Honeywell aerospace.
      </p>
    </div>
  )
}

/* ── View bar ───────────────────────────────────────────────────────
   Page tabs on the left, a two-slot mode toggle on the right. The
   active mode renders as the tan pill, the other as a bare glyph —
   which is what makes frames 1-5/1-126 (pill left) and 1-247 (pill
   right) the same control in two states. */
export function ViewBar({
  page,
  onPage,
  mode,
  onMode,
}: {
  page: Page
  onPage: (p: Page) => void
  mode: Mode
  onMode: (m: Mode) => void
}) {
  return (
    <div className="absolute inset-x-0 top-[278px] pt-4">
      <div className="flex h-10 items-start justify-between px-16">
        <div className="flex items-start gap-3">
          {/* The work tab is a fixed 160 in Figma; the About tab hugs. */}
          <PageTab active={page === 'work'} onClick={() => onPage('work')} minWidth={160}>
            Featured Work
          </PageTab>
          <PageTab active={page === 'about'} onClick={() => onPage('about')}>
            About
          </PageTab>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg p-1.5">
          <ModeSlot
            active={mode === 'carousel'}
            onClick={() => onMode('carousel')}
            label="Carousel"
            icon={<CarouselIcon className={mode === 'carousel' ? 'size-4' : 'size-7'} />}
          />
          <ModeSlot
            active={mode === 'fidget'}
            onClick={() => onMode('fidget')}
            label="Fidget mode"
            icon={<FidgetIcon className={mode === 'fidget' ? 'size-5' : 'size-8'} />}
          />
        </div>
      </div>

      <div className="px-16 pt-3">
        <div className="h-px bg-rule" />
      </div>
    </div>
  )
}

function PageTab({
  active,
  onClick,
  children,
  minWidth,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  minWidth?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active && minWidth ? { minWidth } : undefined}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'rounded-full bg-pill px-3 py-[5px] text-lg font-medium leading-7 tracking-tight text-ink shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_-1px_1px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.9)] outline outline-1 -outline-offset-1 outline-white/50 backdrop-blur-md'
          : 'rounded-full px-3.5 pb-1 pt-[5px] text-lg font-medium leading-7 tracking-tight text-muted transition-colors hover:text-ink'
      }
    >
      {children}
    </button>
  )
}

function ModeSlot({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: ReactNode
}) {
  if (!active) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="flex size-8 items-center justify-center text-muted transition-colors hover:text-ink"
      >
        {icon}
      </button>
    )
  }
  return (
    <span className="flex h-7 items-center gap-[3px] overflow-hidden rounded-[100px] bg-tan px-2.5 py-1.5 outline outline-1 -outline-offset-1 outline-ink">
      <span className="flex items-center justify-center text-ink">{icon}</span>
      <span className="text-center text-base font-medium leading-3 text-ink">{label}</span>
    </span>
  )
}

/* ── Footer ─────────────────────────────────────────────────────────
   Three columns + a centred sign-off. */
export function Footer({ onPage }: { onPage: (p: Page) => void }) {
  return (
    <footer className="absolute inset-x-0 top-[1298px] px-16 py-8">
      <div className="h-px bg-rule" />

      <div className="flex items-start pt-6">
        <div className="w-[403px]">
          <div className="flex items-baseline">
            <span className="font-script text-4xl font-bold leading-10 text-ink">
              K
            </span>
            <span className="text-3xl font-medium leading-10 text-ink">at Lozano</span>
          </div>
          <p className="text-sm leading-6 text-ink">Made in Tempe, AZ</p>
        </div>

        <nav className="flex w-[405px] flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => onPage('work')}
            className="text-base leading-6 tracking-tight text-muted transition-colors hover:text-ink"
          >
            Featured Work
          </button>
          <button
            type="button"
            onClick={() => onPage('about')}
            className="text-base leading-6 tracking-tight text-muted transition-colors hover:text-ink"
          >
            About
          </button>
        </nav>

        <div className="flex flex-1 flex-col items-start gap-4">
          <p className="text-base leading-6 text-muted">Let&apos;s work together!</p>
          <div className="flex items-start gap-6 text-ink">
            <a href="https://www.linkedin.com/" aria-label="LinkedIn" className="opacity-90 hover:opacity-100">
              <LinkedInIcon className="size-6" />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="opacity-90 hover:opacity-100">
              <InstagramIcon className="size-6" />
            </a>
            <a href="https://github.com/" aria-label="GitHub" className="opacity-90 hover:opacity-100">
              <GitHubIcon className="size-6" />
            </a>
          </div>
        </div>
      </div>

      <p className="pt-[82px] text-center text-sm leading-6">
        <span className="text-muted">Built with love &amp; </span>
        <span className="text-ink">592 matchas, no plans to stop</span>
      </p>
    </footer>
  )
}
