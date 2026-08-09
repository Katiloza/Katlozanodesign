# Katlozanodesign

UX design portfolio — Kat Lozano.

This is a direct port of the Figma Make prototype
(`figma.com/make/7J4917Ro4dxZjNHIO5iUFc`). `src/App.tsx`, `src/index.css`, and
`src/imports/` are the generated Make output, copied verbatim.

## Run

```bash
npm install
npm run dev
```

`npm run build` type-checks and emits `dist/` (static, Vercel-ready).

## Structure

- `src/App.tsx` — nav, hero, and the 450vh scroll-jacked strip. Make output, with
  the strip swapped to the SVG export (see below).
- `src/assets/work-card-container.svg` — **the card layout source of truth.**
  A 4502×783 flat export of the whole strip.
- `src/index.css` — font imports, `@theme` tokens, scrollbar styling. Verbatim from Make.
- `src/imports/` — the original generated Make components. No longer rendered;
  kept for reference. Not bundled, since nothing imports them.

## Why the strip is an SVG

The generated `imports/Container` component laid the five cards out as a flex row
with `gap-32`. The design has no such gap and the cards aren't uniformly spaced,
so that row rendered them unevenly. The SVG export carries the real geometry —
black text cards at x=67 and x=3935, the three showcase groups positioned between
them — so the strip now matches the design exactly.

To update the cards, re-export the container from Figma over
`src/assets/work-card-container.svg`. If its dimensions change, update
`STRIP_WIDTH` / `STRIP_HEIGHT` in `App.tsx` to match.

## The strip

Five cards, left to right:

1. Intro — "UX designer based in Tempe, Arizona." + Experience timeline
2. Living Interactive Evidence Synthesis (Mayo Clinic mCRPC) — three browser frames
3. EdPlus course design standards — two browser frames
4. Sensee — app mockups
5. Connect — "Don't want to talk about design?"

## Differences from the Make project

Only the build shell. The Figma-only Vite plugins (`site.json` document shell,
error-overlay replay, React Refresh fallback, `/kit.html` route) are omitted —
they serve the Make editor and have no effect on what renders. `index.html` is a
plain shell instead of the `<!-- figma:* -->` comment-slot template.

## Known constraints of the generated code

Inherited from Make, not introduced here. Flagged so nobody assumes they were
handled:

- Fixed-pixel layout at 744px card height. No responsive behaviour; it does not
  reflow below roughly 1000px.
- No `prefers-reduced-motion` handling — the scroll-jack always runs.
- Cards are `div`s, not links. Nothing in the strip is keyboard-reachable, and
  there are no focus styles.
- Progress dots are presentational, not controls.
- The strip SVG is 10.4 MB (6.9 MB gzipped) — the card screenshots are embedded
  as base64 PNGs. This is by far the page's largest cost and should be addressed
  before launch: extract the five bitmaps, compress them to WebP, and reference
  them from the SVG instead of inlining.
- Card text is outlined in the export, so none of it is selectable, searchable,
  or available to screen readers. The strip carries a descriptive `alt`, which is
  a floor, not a fix.
