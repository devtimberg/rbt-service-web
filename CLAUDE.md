# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile-first web app for a Russian appliance service center (ООО ТТЦ Рембыттехника). Built with Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui (New York style), and Radix UI. All user-facing text is in Russian.

## Commands

```bash
bun run dev          # Dev server (localhost:3000)
bun run build        # Production build
bun run lint         # ESLint
bun run icons:sync   # Generate icon components from SVGs in shared/icons/raw/
make all             # Alias for dev server
make icon            # Alias for icons:sync
```

## Commit Convention

Conventional Commits required: `<type>(optional-scope): <subject>`

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`, `build`, `revert`. No vague messages like `update`, `changes`, `wip`.

## Architecture

The project follows a layered structure inspired by Feature-Sliced Design:

- **`app/`** — Next.js App Router pages and layouts
- **`screens/`** — Page-level components with `ui/` and `model/` subdirectories
- **`widgets/`** — Feature-level components (header, footer, mobile nav)
- **`shared/ui/kit/`** — Reusable UI primitives (Button, IconButton, Input, Sheet, etc.)
- **`shared/lib/`** — Utilities (`cn()` in utils.ts, route config in routes.ts)
- **`shared/icons/`** — Auto-generated icon components (don't edit manually, run `icons:sync`)
- **`shared/styles/`** — Design tokens (OKLCH colors) and Tailwind theme mapping
- **`entities/`, `features/`** — Placeholder directories for future domain logic

### Key Architectural Patterns

**Routing**: All routes defined in `shared/lib/routes.ts` via `ROUTES` constant and `ROUTE_CONFIG`. Never hardcode route strings.

**Sheet Modal System**: The `app/@sheet/` parallel route is the core modal system. `SheetLayout` (`app/@sheet/layout.tsx`) manages bottom sheet open/close state based on pathname, with complex animation timing via `requestAnimationFrame` + `setTimeout`. Sheet content is dynamically rendered from `ROUTE_CONFIG.sheetComponent`.

**IconButton**: Polymorphic component that renders as Next.js `Link` (when `href` provided) or `button`. Supports route-aware active state via `matchPath`, `activeClassName`, and `additionalActivePaths`.

**Styling**: Tailwind-only (no CSS modules). Use `cn()` for conditional classes, `cva()` for variant-based components. Design tokens defined as CSS custom properties in `shared/styles/tokens.css`.

### Adding a New Route

1. Add to `ROUTES` and `ROUTE_CONFIG` in `shared/lib/routes.ts`
2. Create page in `app/[route]/page.tsx`
3. Optionally add `sheetComponent` to config for sheet modal content
4. Update navigation in widgets if needed

### Adding a New Icon

1. Place SVG in `shared/icons/raw/`
2. Run `bun run icons:sync`
3. Import from `@/shared/icons`

## Tech Stack

- **Package manager**: Bun (primary)
- **Path alias**: `@/*` maps to project root
- **Formatting**: Prettier with tailwindcss, classnames, and merge plugins
- **No test framework configured yet**
- **No state management library** — app is mostly presentational with route-based navigation
