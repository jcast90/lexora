# How to Add Features

## Add a Dashboard Page

1. Create `src/app/dashboard/[feature-name]/page.tsx`
2. Add nav item to `venture.config.json` → `dashboard.navItems`:
   ```json
   { "label": "Feature", "href": "/dashboard/feature-name", "icon": "Zap" }
   ```
3. Start with `"use client";`, use `useState` + `useEffect`, fetch via `getRows`
4. Include loading state (`Loader2`), empty state, search filter
5. Use `Dialog` for create/edit, never separate pages

**Rules**: Always try/catch Supabase calls. Always fall back to sample data. Always include loading state.

## Add an API Route

1. Create `src/app/api/[name]/route.ts`
2. Export named functions: `GET`, `POST`, `PUT`, `DELETE`
3. Use `createClient` from `@/lib/supabase/server` (not client)
4. Verify auth: `const { data: { user } } = await supabase.auth.getUser()`
5. Return proper status codes (400, 401, 500)

## Add a Supabase Table

1. Add to `supabase/schema.sql`:
   - UUID primary key with `gen_random_uuid()`
   - `created_at TIMESTAMPTZ DEFAULT now()`
   - `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE` if user-specific
   - Enable RLS + add policies for SELECT/INSERT/UPDATE/DELETE
2. Use CRUD helpers: `getRows`, `insertRow`, `updateRow`, `deleteRow` from `@/lib/supabase/db`

## Add a Custom Hook

1. Create `src/hooks/use-[name].ts`
2. Return `{ data, loading, error }` pattern
3. Use `createClient` from `@/lib/supabase/client`

## Add a UI Component

- Install shadcn: `npx shadcn@latest add [name]` — goes to `src/components/ui/`
- Custom components: `src/components/[name].tsx` — NOT in `ui/`

## File Placement

| What | Where |
|------|-------|
| Pages | `src/app/dashboard/[feature]/page.tsx` |
| API routes | `src/app/api/[name]/route.ts` |
| Hooks | `src/hooks/use-[name].ts` |
| Utilities | `src/lib/[name].ts` |
| Components | `src/components/[name].tsx` |
| Schema | `supabase/schema.sql` |

Never create `src/utils/`, `src/helpers/`, `src/services/`, `src/types/`.

## Package Docs

| Package | Docs |
|---------|------|
| Next.js App Router | https://nextjs.org/docs/app |
| React 19 | https://react.dev/reference/react |
| Tailwind CSS 4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com/docs/components |
| Lucide icons | https://lucide.dev/icons/ |
| Supabase JS | https://supabase.com/docs/reference/javascript |
| Supabase Auth SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Stripe API | https://docs.stripe.com/api |
| Stripe Checkout | https://docs.stripe.com/payments/checkout |
| Resend | https://resend.com/docs/sdks/node |
| Inngest | https://www.inngest.com/docs |
| Playwright | https://playwright.dev/docs/intro |
