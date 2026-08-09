# Katlozanodesign

UX design portfolio — Kat Lozano.

## Run

```bash
npm install
npm run dev
```

`npm run build` type-checks and emits `dist/` (static, Vercel-ready).

## Structure

- `src/content/projects.ts` — the work strip's source of truth. Adding a project is a content edit; the layout does not change.
- `src/components/WorkStrip.tsx` — the pinned horizontal strip and its fallback.
- `src/styles/tokens.css` — palette, type, motion, and the logo-derived texture.
- `src/styles/global.css` — everything else.

## Things worth knowing before you edit

- **Accents are contrast-checked.** Every accent in `projects.ts` passes AA as text on both `--canvas` and `--canvas-raised`. If you add a project, check the new accent before shipping it.
- **Accent is never the only signal.** Each card also carries a left rule, an index numeral, and its own `orientation`.
- **`html` uses `overflow-x: clip`, not `hidden`.** `hidden` would make it a scroll container and break the sticky pin.
- **The strip has a real fallback.** Under 900px or with `prefers-reduced-motion: reduce`, `WorkStrip` switches to `data-mode="static"` — a plain vertical stack, no transform, no pin.
- Card hero images are optional: add `image: { src, alt }` to a project and it fills the card's open middle.
