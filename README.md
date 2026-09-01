# Open Mathematics & Physics Library

A production-oriented foundation for an open mathematics and physics education platform.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Google OAuth, Storage, RLS)
- KaTeX + Markdown math rendering

## Implemented in this phase

- Migrated from Vite demo to Next.js architecture
- Supabase auth scaffolding (Google sign-in callback flow)
- Core normalized database schema + row-level security policies
- Public library-first information architecture:
  - `/`
  - `/library`
  - `/mathematics`
  - `/physics`
  - `/[subject]/[course]`
  - `/[subject]/[course]/[lesson]`
- Lesson reader foundation with:
  - comfortable typography
  - KaTeX rendering
  - sticky table of contents on desktop
  - mobile collapsible contents
- Reader and author route scaffolds for future phases
- Search API and search page foundation
- SEO baseline (`sitemap`, `robots`, semantic routes)

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy env template and configure values:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

4. Validate types:

```bash
npm run lint
```

5. Create production build:

```bash
npm run build
```

## Supabase setup

1. Create a Supabase project.
2. Enable Google OAuth provider in Auth settings.
3. Add redirect URL: `http://localhost:3000/auth/callback` (and production URL equivalent).
4. Run SQL migration from:

`/home/runner/work/website/website/supabase/migrations/0001_phase1_foundation.sql`

5. Seed `subjects`, `categories`, `courses`, and `lessons` as needed (app includes fallback seed data if DB is empty/unavailable).

## Deployment

- Recommended: Vercel connected to this GitHub repository.
- Configure environment variables from `.env.example` in Vercel.
- CI workflow validates type-check and build on pushes/PRs.

## Environment variables

See `.env.example` for all required keys.

## Notes

This is Phase 1 foundation. Advanced authoring, contribution workflows, comprehensive search ranking, and PDF compilation are intentionally scaffolded for subsequent implementation phases.
