# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ecommerce for **Rebozos Mary** — Mexican artisanal shawls. Built on Next.js 16 (App Router) + Payload CMS v3 running together in one process, backed by PostgreSQL (Supabase), with Stripe for payments (cards + OXXO, Mexico).

## Commands

```bash
pnpm dev               # Start dev server at localhost:3000
pnpm build             # Production build
pnpm lint              # ESLint
pnpm generate:types    # Regenerate src/payload-types.ts from collection schemas (run after every schema change)
pnpm generate:importmap # Regenerate Payload admin import map

# Tests
pnpm test:int          # Integration tests (Vitest) — hits real DB, no mocks
pnpm test:e2e          # E2E tests (Playwright) — requires dev server running on :3000
pnpm test              # Both suites

# Run a single integration test file
pnpm test:int -- path/to/file.int.spec.ts
```

## Architecture

### Dual-route structure in `src/app/`

Next.js App Router uses two route groups that run side by side:

- **`(frontend)/`** — public-facing storefront pages. Uses React Server Components; fetches data by calling `getPayload({ config })` directly (no HTTP round-trip).
- **`(payload)/`** — Payload admin panel at `/admin` and REST/GraphQL API at `/api`. Mounted via `withPayload()` in `next.config.ts`. Do not add storefront pages here.

### Payload CMS

`src/payload.config.ts` is the single source of truth for all collections, plugins, and the database adapter. All collections live in `src/collections/` and must be imported and added to the `collections` array there.

`src/payload-types.ts` is **auto-generated** — never edit it manually. Run `pnpm generate:types` whenever a collection schema changes; TypeScript will complain until you do.

#### Adding a collection

1. Create `src/collections/MyCollection.ts` exporting a `CollectionConfig`.
2. Import and add it to `collections: [...]` in `payload.config.ts`.
3. Run `pnpm generate:types`.

#### Querying from Server Components

```ts
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config: await config })
const items = await payload.find({ collection: 'products' })
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `PAYLOAD_SECRET` | Random secret for Payload JWT signing |

### Path aliases (`tsconfig.json`)

- `@/*` → `./src/*`
- `@payload-config` → `./src/payload.config.ts`

### Media

Uploaded files are served at `/api/media/file/**`. The `Media` collection (`src/collections/Media.ts`) handles all uploads; `sharp` is used for image optimization.

### Tests

- **Integration** (`tests/int/*.int.spec.ts`): Vitest + jsdom, instantiates Payload directly against the real database. No mocking the DB.
- **E2E** (`tests/e2e/*.e2e.spec.ts`): Playwright, expects `localhost:3000` running. Helpers for seeding/cleaning test users are in `tests/helpers/`.
