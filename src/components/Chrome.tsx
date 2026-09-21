import type { CSSProperties, ReactNode } from 'react'
import { CarouselIcon, FidgetIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from './icons'

export type Page = 'work' | 'about'
export type Mode = 'carousel' | 'fidget'

/* Every value here is the one the design file reports. The board is 1440
   wide and the blocks stack in normal flow, so a taller About view pushes
   the footer down instead of colliding with it. */

/* ── Nav ────────────────────────────────────────────────────────────
   111px tall. Logo left, status chip right. */
export function Nav({ showStatus = true }: { showStatus?: boolean }) {
  return (
    <header className="relative" style={{ height: 111 }}>
      <a
        href="#top"
        aria-label="Kat Lozano — home"
        className="absolute flex items-center justify-center font-script font-bold italic no-underline"
        style={{
          left: 60,
          top: 37,
          width: 80,
          height: 74,
          fontSize: 64,
          lineHeight: '44px',
          letterSpacing: '-0.4px',
          color: 'var(--color-ink)',
        }}
      >
        K
      </a>

      {showStatus && (
        <div
          className="absolute box-border flex items-center justify-center whitespace-nowrap rounded-full bg-live-bg"
          style={{ right: 46, top: 40, height: 28, gap: 4, padding: '2px 10px 2px 6px' }}
        >
          <span className="flex size-4 shrink-0 items-center justify-center">
            <span className="size-2 rounded-full bg-live" />
          </span>
          <span
            className="font-semibold text-live"
            style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.08px' }}
          >
            Working on something cool? Let&rsquo;s{' '}
            <a href="mailto:kalozan1@asu.edu" className="font-semibold text-live underline">
              connect!
            </a>
          </span>
        </div>
      )}
    </header>
  )
}

/* ── Masthead ───────────────────────────────────────────────────────
   Name + the two-line positioning statement. */
export function Masthead() {
  return (
    <div style={{ padding: '30px 64px 0' }}>
      <h1
        className="text-left font-medium text-ink"
        style={{
          margin: '16px 0 16px',
          fontSize: 36,
          lineHeight: '54px',
          letterSpacing: '0.45px',
        }}
      >
        Kat Lozano
      </h1>
      <p
        className="text-left text-ink"
        style={{ margin: '0 0 8px', fontSize: 24, lineHeight: '26px' }}
      >
        &ldquo;I design to empower the people who matter.&rdquo;
      </p>
      <p
        className="m-0 text-left text-muted"
        style={{ fontSize: 24, lineHeight: '27px', letterSpacing: '0.45px' }}
      >
        Previously designed for EdPlus, Mayo Clinic, and Honeywell aerospace.
      </p>
    </div>
  )
}

/* ── View bar ───────────────────────────────────────────────────────
   Page tabs on the left, the two-slot mode toggle on the right. Both
   mode slots are pills; only the active one is filled. */
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
    <div style={{ paddingTop: 10 }}>
      <div
        className="box-border flex items-start justify-between"
        style={{ height: 58, padding: '16px 64px' }}
      >
        <div className="flex items-start" style={{ gap: 10 }}>
          <PageTab
            active={page === 'work'}
            onClick={() => onPage('work')}
            style={{ width: 162, height: 39, padding: '5px 13px' }}
            glass
          >
            Featured Work
          </PageTab>
          <PageTab
            active={page === 'about'}
            onClick={() => onPage('about')}
            style={{ height: 38, padding: '5px 14px 4px' }}
          >
            About
          </PageTab>
        </div>

        <div
          className="box-border flex items-center justify-end rounded-lg"
          style={{ height: 42, gap: 6, padding: 6 }}
        >
          <ModeSlot
            active={mode === 'carousel'}
            onClick={() => onMode('carousel')}
            label="Carousel"
            icon={<CarouselIcon className="size-5 shrink-0" />}
          />
          <ModeSlot
            active={mode === 'fidget'}
            onClick={() => onMode('fidget')}
            label="Fidget mode"
            icon={<FidgetIcon className="size-5 shrink-0" />}
          />
        </div>
      </div>

      <div style={{ padding: '12px 64px' }}>
        <div style={{ height: 1, background: 'var(--color-rule)' }} />
      </div>
      <div style={{ height: 16 }} />
    </div>
  )
}

/* The design draws the rim light with `outline`. Here it rides on the
   box-shadow instead (an inset spread ring is pixel-equivalent at 1px), so
   `outline` stays free for the browser's focus ring. */
const RIM = 'inset 0 0 0 1px rgba(255,255,255,.5)'

const TAB_ON = {
  background: 'rgba(228,228,231,0.6)',
  color: 'var(--color-ink)',
  boxShadow:
    '0 2px 8px rgba(0,0,0,0.06), inset 0 -1px 1px rgba(0,0,0,0.02), inset 0 1px 1px rgba(255,255,255,0.9)',
}
const TAB_OFF = { background: 'transparent', color: 'var(--color-muted)', boxShadow: 'none' }

function PageTab({
  active,
  onClick,
  children,
  style,
  glass = false,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  style?: CSSProperties
  /** The Featured Work tab carries the rim light and backdrop blur. */
  glass?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="box-border cursor-pointer rounded-full border-0 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{
        font: 'inherit',
        fontSize: 18,
        fontWeight: 500,
        lineHeight: '27px',
        letterSpacing: '0.09px',
        transition: 'color .15s',
        ...(active ? TAB_ON : TAB_OFF),
        ...(glass
          ? {
              boxShadow: [active ? TAB_ON.boxShadow : null, RIM].filter(Boolean).join(', '),
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }
          : null),
        ...style,
      }}
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="box-border flex shrink-0 cursor-pointer items-center overflow-hidden border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{
        height: 28,
        gap: 3,
        borderRadius: 100,
        padding: '6px 10px',
        font: 'inherit',
        background: active ? 'var(--color-tan)' : 'transparent',
        color: active ? 'var(--color-ink)' : 'var(--color-muted)',
        // The active ring is a box-shadow, not an outline, so the focus
        // ring is still available to the browser.
        boxShadow: `inset 0 0 0 1px ${active ? 'var(--color-ink)' : 'rgba(66,43,42,0)'}`,
        transition:
          'background-color 280ms ease-in, color 280ms ease-in, box-shadow 280ms ease-in',
      }}
    >
      {icon}
      <span
        className="whitespace-nowrap text-center font-medium"
        style={{ fontSize: 16, lineHeight: '13.5px', letterSpacing: '-0.3px' }}
      >
        {label}
      </span>
    </button>
  )
}

/* ── Footer ─────────────────────────────────────────────────────────
   A four-column grid of 385px tracks plus a centred sign-off. */
export function Footer({ onPage }: { onPage: (p: Page) => void }) {
  return (
    <footer style={{ padding: '32px 64px', marginTop: 88 }}>
      <div style={{ height: 1, background: 'var(--color-rule)' }} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 385px)',
          gap: 20,
          paddingTop: 20,
        }}
      >
        <div>
          <div className="flex items-baseline">
            <span
              className="font-script font-bold italic text-ink"
              style={{ fontSize: 36, lineHeight: '44px', letterSpacing: '-0.4px' }}
            >
              K
            </span>
            <span
              className="font-medium text-ink"
              style={{ fontSize: 30, lineHeight: '45px' }}
            >
              at Lozano
            </span>
          </div>
          <p
            className="m-0 text-ink"
            style={{ fontSize: 13.8125, lineHeight: '24.172px', letterSpacing: '-0.136px' }}
          >
            Made in Tempe, AZ
          </p>
        </div>

        <nav className="flex flex-col items-start" style={{ gap: 8 }}>
          <FooterLink onClick={() => onPage('work')}>Featured Work</FooterLink>
          <FooterLink onClick={() => onPage('about')}>About</FooterLink>
        </nav>

        <div className="flex flex-col items-start" style={{ gap: 16 }}>
          <p className="m-0 text-muted" style={{ fontSize: 16, lineHeight: '24px' }}>
            Let&apos;s work together!
          </p>
          <div className="flex items-start text-ink" style={{ gap: 24 }}>
            <a
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              className="text-ink opacity-90 hover:opacity-100"
            >
              <LinkedInIcon className="block size-6" />
            </a>
            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="text-ink opacity-90 hover:opacity-100"
            >
              <InstagramIcon className="block size-6" />
            </a>
            <a
              href="https://github.com/"
              aria-label="GitHub"
              className="text-ink opacity-90 hover:opacity-100"
            >
              <GitHubIcon className="block size-6" />
            </a>
          </div>
        </div>
      </div>

      <p
        className="m-0 text-center"
        style={{ paddingTop: 64, fontSize: 14, lineHeight: '22.75px' }}
      >
        <span className="text-muted">Built with love &amp; </span>
        <span className="text-ink">592 matchas, no plans to stop</span>
      </p>
    </footer>
  )
}

function FooterLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer border-0 bg-transparent text-muted transition-colors hover:text-ink"
      style={{
        padding: '0 2px',
        font: 'inherit',
        fontSize: 16,
        lineHeight: '24px',
        letterSpacing: '0.16px',
      }}
    >
      {children}
    </button>
  )
}
