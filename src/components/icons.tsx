type IconProps = { className?: string }

/** Two stacked panes — the carousel mode glyph. */
export function CarouselIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="1.1" y="3.2" width="3.1" height="9.6" rx="1" fill="currentColor" />
      <rect x="4.7" y="3.2" width="6" height="9.6" rx="1" fill="currentColor" />
    </svg>
  )
}

/** Three loose blobs — the fidget mode glyph. */
export function FidgetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect
        x="4.08"
        y="2.06"
        width="6"
        height="6"
        rx="1.4"
        fill="currentColor"
        transform="rotate(7.82 4.08 2.06)"
      />
      <rect
        x="11.92"
        y="4.43"
        width="6"
        height="6"
        rx="1.4"
        fill="currentColor"
        transform="rotate(20.32 11.92 4.43)"
      />
      <rect x="2.72" y="9.5" width="8" height="8" rx="1.8" fill="currentColor" />
    </svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" fill="none" className={className} aria-hidden="true">
      <rect x="1.7" y="4.2" width="6.6" height="5" rx="1.2" stroke="currentColor" strokeWidth="1" />
      <path d="M3.4 4.2V3a1.6 1.6 0 0 1 3.2 0v1.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ReloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 6a4 4 0 1 1-1.2-2.85M10 1.5V4H7.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <circle cx="2.2" cy="6" r="0.9" fill="currentColor" />
      <circle cx="6" cy="6" r="0.9" fill="currentColor" />
      <circle cx="9.8" cy="6" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.6c2.5 0 4.5 2 4.5 4.5 0 3.2-4.5 8.3-4.5 8.3S3.5 9.3 3.5 6.1C3.5 3.6 5.5 1.6 8 1.6Z"
        fill="currentColor"
      />
      <circle cx="8" cy="6.1" r="1.7" fill="#fff" />
    </svg>
  )
}

export function CapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M8 2 15 5.4 8 8.8 1 5.4 8 2Z" fill="currentColor" />
      <path d="M3.4 7.2v3c0 1.1 2.1 2 4.6 2s4.6-.9 4.6-2v-3" fill="currentColor" />
    </svg>
  )
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z" />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.25 9.25 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}
