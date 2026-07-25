# Legacy Pharma content (archived — not part of the Healthcare app)

These files are **remnants of the sibling project [`kr-pharma-guidebook-hub`](https://github.com/kalilurrahman/kr-pharma-guidebook-hub)** that were carried over when this Healthcare handbook was scaffolded from it. They are **not wired into the Healthcare application**:

- No route in `src/App.tsx` renders any of them.
- Nothing in the live app imports them (verified: `pharma-data.ts`, `KeyStatsPage.tsx`, `PharmaHeader.tsx`, and `PharmaFooter.tsx` have zero importers outside this folder).
- They are isolated here so they no longer create dual-brand (Pharma vs Healthcare) confusion in the main `components/`, `pages/`, `data/`, and `types/` directories.

## What's here

| File | Was | Purpose (Pharma project) |
|---|---|---|
| `pharma-data.ts` | `src/data/` | Full Pharma DX Handbook content (~30 chapters) |
| `pharma.types.ts` | `src/types/` | Types for the Pharma handbook |
| `KeyStatsPage.tsx` | `src/pages/` | Pharma "Key Stats" dashboard (un-routed) |
| `PharmaHeader.tsx` | `src/components/` | Pharma site header |
| `PharmaFooter.tsx` | `src/components/` | Pharma site footer |
| `pharma-logo.png` | `src/assets/` | Pharma brand mark |

Internal imports were repointed to relative paths (`./…`) so this folder is self-contained; shared primitives (e.g. `@/components/ThemeToggle`) still resolve via the `@/` alias.

## Also orphaned (left in place)

`public/resources/Pharma_*.{pdf,docx,html}` and `public/pharma-logo.png` are downloadable Pharma artifacts that are **not linked from the Healthcare app**. They were left in `public/` to avoid changing any external URLs; move or remove them if the Pharma content should live only in its own repo.

## Options from here

1. **Delete** this folder (and the `public/` Pharma artifacts) if the Pharma content should live only in `kr-pharma-guidebook-hub`.
2. **Keep + wire up** a `/pharma` route intentionally if a combined Pharma + Healthcare property is desired — at which point these stop being "legacy."

Until one of those is chosen, treat everything in this folder as archived.
