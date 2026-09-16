# Katlozanodesign

UX design portfolio — Kat Lozano.

A hand-written implementation of five Figma frames from
[`figma.com/design/Uv2kYZfXVNNelZO0aoVjFP`](https://www.figma.com/design/Uv2kYZfXVNNelZO0aoVjFP/Portfolio):

| Node     | Frame                | What it is                                  |
| -------- | -------------------- | ------------------------------------------- |
| `1:5`    | Portfolio work page  | Carousel, mCRPC card active, neighbour left  |
| `1:126`  | Portfolio work page  | Carousel, token card active, neighbour right |
| `1:247`  | Portfolio work page  | Fidget mode, resting                         |
| `7:19`   | Portfolio work page  | Fidget mode, card hovered                    |
| `1:374`  | Portfolio about page | About                                        |

The five frames are two pages (`work`, `about`) × two work modes
(`carousel`, `fidget`), plus fidget's hover state — so they're built as
state, not as five separate screens. Every frame shares one chrome.

## Run

```bash
npm install
npm run dev
```

`npm run build` type-checks and emits `dist/` (static, Vercel-ready).

## Layout approach

All five frames are 1440 wide and put every block at the same fixed y:
nav `0`, masthead `111`, view bar `278`, stage `402`, footer `1298`.
`App.tsx` lays those out absolutely at exactly those coordinates and
scales the whole 1440 board down to narrower viewports. That's what keeps
it on the design; it also means there is **no responsive reflow** — below
1440 the page shrinks rather than rearranging. Design mobile frames and
this is the thing to revisit.

## Structure

- `src/App.tsx` — page/mode/carousel state and the 1440 artboard.
- `src/components/Chrome.tsx` — nav, masthead, view bar, footer.
- `src/components/CarouselStage.tsx` — the active card plus one peeking
  neighbour, rendered as a sliver of that card's own backdrop.
- `src/components/FidgetStage.tsx` — the scattered layout and its hover
  wash. Positions are measured off frame `1:247`, in frame coordinates.
- `src/components/AboutPage.tsx` — section rail, portrait, notes window,
  experience list.
- `src/components/BrowserWindow.tsx` — the macOS frame and glass label.
- `src/data/projects.ts` — the case studies, in carousel order.
- `src/index.css` — tokens (real Figma hexes, not Tailwind's
  approximations), fonts, dot grid.
- `figma-refs/` — the 2× frame exports, kept as the visual source of
  truth to diff against.

## Where this departs from the frames

- **Carousel order.** `1:5` puts the design-system card immediately left
  of the mCRPC card; `1:126` puts the mCRPC card immediately right of the
  token card. Both can't be true of one sequence. `projects.ts` fixes an
  order and the carousel renders real neighbours, so each frame is a
  reachable state rather than a transcription.
- **The design-system card** has no screenshot in the file — only its
  gradient spine appears. Its backdrop is a CSS gradient sampled off that
  sliver; `screenshot: null` renders a placeholder until one exists.
- **Fonts.** Figma's "Dreamboat" and "Dreaming Outloud Script" aren't
  webfonts here; `--font-script` and `--font-hand` in `index.css` point
  at Dancing Script and Caveat. Swap the tokens if you have the licences.

## Assets

`src/assets/work/` was cut from the 2× frame exports, not from source
files:

- `card-bg-mcrpc.jpg` / `card-bg-tokens.jpg` — card backdrops. Both had
  the browser window and label card baked into the crop; the mCRPC label
  was painted out by interpolation and the token gradient was refitted
  from its clean border. **Re-export these two image layers from Figma
  when you get a chance** — the repairs are good enough to ship but they
  are repairs.
- `shot-mcrpc.jpg` / `shot-tokens.jpg` — case study screenshots.
- `fidget-a/b/c.png` — the desk toys. Cropped on their white background
  rather than with alpha, so the page's dot grid doesn't show through
  behind them. Raw exports with transparency would fix that.
- `portrait.jpg` — about page photo.

Unused leftovers from the extraction pass — `card-bg-tokens-raw.jpg`,
`portrait.png`, `shot-mcrpc.png`, `shot-tokens.png` — are safe to delete.
Nothing imports them, so Vite never bundles them.

## Known constraints

- No responsive reflow below 1440 (see **Layout approach**).
- The fidget toys are decorative `img`s, not draggable. The name promises
  more interaction than the frames specify.
- `prefers-reduced-motion` is honoured for transitions only.
- The former Figma Make port — `src/imports/` and
  `src/assets/work-card-container.svg`, which drove the old 450vh
  scroll-jacked strip — is no longer rendered or imported, so it isn't
  bundled. It's still on disk (10MB of it) and implements an older
  design; delete both when you're happy with this build.
