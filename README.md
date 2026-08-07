# DuoNerds Studio

Next.js website for DuoNerds: public service pages, shop, calculator and the customer portal foundation.

## Local development

```bash
pnpm install
pnpm dev
```

Checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Portal setup

The portal UI is available at `/login`, `/registrieren`, `/dashboard` and `/admin`. It connects to Supabase when these public variables are present in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Run `supabase/migrations/001_portal.sql` in the Supabase SQL editor before creating real accounts. The migration creates profiles, role checks, systems, system access, tickets, ticket messages and an admin-only audit log with row-level security.

The public website remains a static export. Until the environment variables and migration are configured, portal pages deliberately show a safe setup state instead of pretending that demo accounts are production authentication.

