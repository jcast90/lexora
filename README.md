# Venture Template

A production-ready Next.js SaaS template used by Venture OS to build new products autonomously.

## What's Included

- **Landing page** — Conversion-optimized, dark theme, waitlist signup
- **Dashboard** — Sidebar layout, stat cards, settings, API key management
- **Auth pages** — Login, signup (Supabase Auth)
- **API routes** — Waitlist signup with Supabase + Resend email
- **Theming** — Edit `venture.config.json` to customize everything

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase (Auth + Database)
- Resend (Email)
- Lucide React (Icons)

## Quick Start

```bash
# Clone and install
git clone https://github.com/jcast90/venture-template.git my-product
cd my-product
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your Supabase and Resend keys

# Customize — edit venture.config.json with your product name, copy, and pricing

# Run
npm run dev
```

## Customization

All product-specific content is in `venture.config.json`:

| Field | What it controls |
|-------|-----------------|
| `name` | Product name (nav, footer, meta tags) |
| `tagline` | Meta description, hero subtext |
| `brand.primary` | Primary color throughout |
| `brand.gradient` | CTA buttons, gradient text |
| `landing.headline` | Hero headline |
| `landing.painStats` | Pain point statistics section |
| `landing.steps` | How it works section |
| `landing.pricing` | Pricing tiers |
| `dashboard.navItems` | Sidebar navigation links |

## Deploy

```bash
npx vercel --prod
```
