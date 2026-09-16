import type { CSSProperties } from 'react'
import { LockIcon, MoreIcon, ReloadIcon } from './icons'

/**
 * The macOS-style browser frame every case study sits in.
 * 44px title bar, traffic lights, address pill, then the screenshot.
 */
export function BrowserWindow({
  url,
  screenshot,
  alt,
  style,
  className = '',
  chromeWidth,
}: {
  url: string
  screenshot: string | null
  alt: string
  style?: CSSProperties
  className?: string
  /** Width of the address pill; the design uses 320px on wide cards. */
  chromeWidth?: number
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[10px] bg-white opacity-95 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_12px_48px_rgba(0,0,0,0.04)] outline outline-1 -outline-offset-1 outline-chrome-line ${className}`}
      style={style}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-chrome-line bg-chrome px-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>

        <div
          className="flex items-center gap-2 rounded-md bg-white px-3 py-1 outline outline-1 -outline-offset-1 outline-chrome-line"
          style={{ width: chromeWidth ?? 320 }}
        >
          <LockIcon className="size-2.5 shrink-0 text-chrome-text" />
          <span className="line-clamp-1 text-xs text-chrome-text">{url}</span>
        </div>

        <div className="flex items-center gap-3 text-chrome-text">
          <ReloadIcon className="size-3" />
          <MoreIcon className="size-3" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {screenshot ? (
          <img src={screenshot} alt={alt} className="size-full object-cover object-left-top" />
        ) : (
          <div className="flex size-full items-center justify-center bg-chrome text-sm text-muted">
            Screenshot pending export
          </div>
        )}
      </div>
    </div>
  )
}

/** The floating glass caption that names the case study. */
export function LabelCard({
  title,
  color,
  style,
}: {
  title: string
  color: string
  style?: CSSProperties
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[20px] bg-white/90 py-3 pl-3 pr-6 shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.08)] outline outline-1 -outline-offset-1 outline-black/5 backdrop-blur-lg"
      style={style}
    >
      <span className="flex flex-col gap-1">
        <span
          className="text-sm font-medium leading-4 tracking-tight"
          style={{ color }}
        >
          {title}
        </span>
        <span
          className="text-sm leading-4 tracking-tight opacity-50"
          style={{ color }}
        >
          View Case Study
        </span>
      </span>
    </div>
  )
}
