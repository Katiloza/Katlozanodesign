import { useState } from 'react'
import { CapIcon, PinIcon } from './icons'
import { experience } from '@/data/projects'
import portrait from '@/assets/work/portrait.png'

type Section = 'hi' | 'experience' | 'community'

/* Frame 1-374. Left rail of section links, a portrait, a macOS notes
   window holding the intro, then the experience list. */
export function AboutPage() {
  const [section, setSection] = useState<Section>('hi')

  return (
    <div className="px-16 pt-10">
      <div className="flex items-start gap-[18px]">
        <nav className="flex w-52 shrink-0 flex-col items-start gap-2 pb-8">
          {(
            [
              ['hi', 'hi!'],
              ['experience', 'experience'],
              ['community', 'community'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`rounded-full px-0.5 text-base font-medium leading-6 tracking-wide transition-colors ${
                section === id ? 'text-[#3b82f6]' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-20 pb-8">
          <div className="relative h-[509px] w-[848px]">
            <div className="absolute left-0 top-0 w-[304px] py-8">
              <img
                src={portrait}
                alt="Kat holding a Tears for Fears record"
                className="h-[389px] w-[304px] rounded-lg object-cover"
              />
            </div>

            <NotesWindow />
          </div>

          <div className="flex w-[1158px] items-start justify-between">
            <h2 className="text-3xl font-medium leading-10 text-ink">Experience</h2>

            <div className="flex w-[691px] flex-col gap-12 pt-1.5">
              {experience.map((e) => (
                <div key={e.org}>
                  {e.lead ? (
                    <p className="pl-0.5 text-lg leading-7 tracking-tight">
                      <span className="font-medium text-ink">{e.org}</span>
                      <span className="text-muted">, {e.dates}</span>
                    </p>
                  ) : (
                    <>
                      <p className="text-lg font-medium leading-6 tracking-tight text-ink">{e.org}</p>
                      <p className="text-base leading-5 tracking-tight text-muted">
                        {e.role}, {e.dates}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The cream "notes" window — a real window, not a screenshot. */
function NotesWindow() {
  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-lg shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
      style={{ left: 389.57, top: 27, width: 458.78, height: 457.78 }}
    >
      <div className="relative flex h-7 shrink-0 items-start gap-2.5 bg-[#e9dcae] p-2.5">
        <div className="flex items-center gap-[5px]">
          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="absolute left-1/2 top-[7px] flex -translate-x-1/2 items-center gap-1.5">
          <span className="size-3.5 rounded-sm bg-gradient-to-b from-amber-300 to-white shadow-[0_0.5px_1px_rgba(0,0,0,0.15),inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
          <span className="text-xs leading-3 text-black/40">notes</span>
        </div>
      </div>

      <div className="relative flex-1 bg-white px-6 py-5">
        <h2 className="text-3xl font-medium leading-9 text-zinc-600">hi, i&apos;m kat!</h2>

        <div className="flex items-center gap-3.5 pt-6">
          <span className="flex items-center gap-2">
            <PinIcon className="size-4 text-zinc-400" />
            <span className="text-base leading-6 tracking-tight text-zinc-400">AZ</span>
          </span>
          <span className="flex items-center gap-2">
            <CapIcon className="size-4 shrink-0 text-zinc-400" />
            <span className="text-sm leading-4 tracking-tight text-zinc-400">
              M.S. UX &amp; B.S. Human Systems Engineering, ASU
            </span>
          </span>
        </div>

        <p className="max-w-[352px] pt-6 text-base leading-6 tracking-tight text-zinc-600">
          I love art, business, technology, &amp; fascinated by the ways that they can work together to
          make the world a better, more accessible place. I obsess over crafting thoughtful tools that
          bridge user &amp; business goals.
        </p>

        <div className="absolute bottom-8 left-6 flex items-end gap-16">
          <span className="flex flex-col gap-2">
            <span className="text-base lowercase leading-4 text-black">best,</span>
            <span className="font-hand text-xl lowercase leading-4 text-black/50">
              Kat lozano
            </span>
          </span>
          <span className="rotate-[4.74deg] text-2xl leading-6 text-black">{'{ ^-^ }'}</span>
        </div>
      </div>
    </div>
  )
}
