---
name: verify
description: Run build, type check, and lint to verify the project compiles cleanly. Use after making code changes.
invocation: user
---

Verify the project builds and passes all checks.

## Steps

1. **Run `npm run build`** — must exit 0
2. **Run `npx tsc --noEmit`** — must exit 0
3. **Run `npm run lint`** — must exit 0

If any step fails:
- Read the error output carefully
- Fix the issue (check `AGENTS.md` for import rules if it's an import error)
- Re-run the failing step
- Repeat until all 3 pass

## Common fixes
- `Module not found: @/components/ui/Foo` → lowercase the path: `@/components/ui/foo`
- `has no exported member 'foo'` → PascalCase the component: `Foo`
- `onChange does not exist on Select` → use `onValueChange`
- Type errors in generated pages → check `docs/components.md` for correct prop types
