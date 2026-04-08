---
name: add-page
description: Scaffold a new dashboard page with correct imports, loading state, and CRUD pattern. Use when adding a feature page to the dashboard.
invocation: user
---

Create a new dashboard page. The user provides the feature name as an argument (e.g., `/add-page contacts`).

## Steps

1. **Read `AGENTS.md`** for import rules and styling conventions
2. **Read `docs/patterns.md`** for the CRUD page pattern
3. **Create the page file** at `src/app/dashboard/$ARGUMENTS/page.tsx`
4. **Base it on the CRUD pattern** from `docs/patterns.md`, adapting:
   - The interface type and fields to match the feature
   - The table name to match the feature (e.g., `contacts`)
   - The sample data to be realistic for the product (read `venture.config.json` for context)
   - The stats cards to be relevant to the feature
   - The column headers and table cells
5. **Add a nav item** to `venture.config.json` → `dashboard.navItems`
6. **Run `npm run build`** to verify it compiles
7. If the build fails, fix the errors and rebuild

## Critical rules
- Import paths are lowercase: `@/components/ui/card`
- Component names are PascalCase: `Card`, `Button`
- Start with `"use client";`
- Include loading state with `Loader2`
- Wrap Supabase calls in try/catch with sample data fallback
- Use Dialogs for create/edit, not separate pages
