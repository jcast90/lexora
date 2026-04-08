# Known Issues — Lessons from Past Builds

Read this before starting work. Add new entries when you fix a bug or resolve a repeated issue.

---

### Uppercase import paths cause build failure on Linux
**Error**: `Module not found: Can't resolve '@/components/ui/Card'`
**Cause**: LLM generated uppercase file paths. Linux is case-sensitive; macOS is not.
**Fix**: Always use lowercase paths: `@/components/ui/card`

### Lowercase component names cause build failure
**Error**: `'"@/components/ui/card"' has no exported member named 'card'`
**Cause**: LLM used `card` instead of `Card` in the import braces.
**Fix**: Component names are always PascalCase: `import { Card } from "@/components/ui/card"`

### Select onChange doesn't exist
**Error**: `Property 'onChange' does not exist on type 'IntrinsicAttributes & Props<...>'`
**Cause**: shadcn Select uses Base UI, not native HTML select. It doesn't have `onChange`.
**Fix**: Use `onValueChange` on the root `<Select>` component.

### Lowercase lucide-react icons cause build failure
**Error**: `'"lucide-react"' has no exported member named 'messagesquare'`
**Cause**: LLM used lowercase icon names. Lucide exports are PascalCase.
**Fix**: Always PascalCase: `MessageSquare`, `Loader2`, `ChevronDown`

### Missing Supabase env vars
**Error**: Browser client throws "Missing Supabase environment variables"; dashboard shows empty data during build.
**Cause**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set. At build time, a placeholder client is used so static generation succeeds. At runtime, the browser client throws explicitly and the middleware redirects `/dashboard` to `/login` in production.
**Fix**: Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` or Vercel environment variables and redeploy.

### Build stderr captured empty — auto-fix agent gets no error context
**Error**: Build fails but error message shows empty ` ``` ``` ` in Discord.
**Cause**: `npm run build 2>&1` merged stderr into stdout, but code read from `stderr` (always empty).
**Fix**: Capture stdout and stderr separately, then combine: `build_output = stdout + "\n" + stderr`

### LLM-generated pages reference non-installed components
**Error**: `Module not found: Can't resolve '@/components/ui/popover'`
**Cause**: LLM assumed standard shadcn components were installed. Only 14 are.
**Fix**: Check AGENTS.md for the complete list of installed components. Do not import Accordion, Popover, Tooltip, Switch, Checkbox, RadioGroup, etc.
