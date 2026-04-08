@AGENTS.md

# Claude-Specific Instructions

## Behavior
- Read `AGENTS.md` first — it has all import rules, conventions, and project structure
- Read `docs/patterns.md` before generating dashboard pages
- Run `npm run build` after making changes to verify they compile
- Use `npx tsc --noEmit` to type-check without building

## Supabase Setup
1. Create project at supabase.com
2. Copy URL + anon key to `.env.local`
3. Run `supabase/schema.sql` in SQL Editor

## Configuration
Edit `venture.config.json` for product name, tagline, brand colors, landing copy, pricing tiers, dashboard nav items. Toggle `flags.waitlistMode` for pre-launch vs live.

## Deployment
```bash
npx vercel --prod
```


## This Venture: Lexora

- **Venture ID**: 819e32730abf
- **Brand**: Lexora
- **Domain**: lexora.co
- **Palette**: emerald
- **Deployed**: lexora.vercel.app
- **GitHub**: github.com/jcast90/lexora
- **Built by**: Venture OS autonomous pipeline

### E2E Tests
```bash
# Run against local dev
npx playwright test

# Run against deployed site
BASE_URL=https://lexora.vercel.app npx playwright test e2e/visual-qa.spec.ts
```
