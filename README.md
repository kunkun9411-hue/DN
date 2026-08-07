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

### Discord access and product roles

The portal supports Discord as the primary registration and login method. In Supabase, enable the Discord provider and add the Supabase Auth callback URL shown in the provider settings to the Discord application's OAuth2 redirect URLs. The client only receives the user's basic Discord profile; server-side role checks happen in the Edge Function below.

Deploy `supabase/functions/sync-discord-access/index.ts` as `sync-discord-access` and set its secrets in Supabase:

```text
DISCORD_GUILD_ID=1535241328198418574
DISCORD_BOT_TOKEN=            # secret; never commit this
```

The bot must be a member of the Duo Nerds Service server and have permission to view members. Product access is configured by exact Discord role names in `product_role_name_access`. The current server roles include `Owner`, `Admin`, `Mod`, `Support`, `Product Author`, `Giveaways`, `Member` and `Events`. The admin panel provides these names as suggestions, for example:

```sql
insert into public.product_role_name_access (product_id, discord_role_name, label)
values ('metin2-ui-check', 'Product Author', 'Metin2 UI Check')
on conflict (product_id, discord_role_name) do nothing;
```

After login, the function reads the member's roles, refreshes `user_product_access`, and the portal shows the products available to that Discord account. The invite link for onboarding is `https://discord.gg/225zd5PS9y`.

The public website remains a static export. Until the environment variables and migration are configured, portal pages deliberately show a safe setup state instead of pretending that demo accounts are production authentication.
