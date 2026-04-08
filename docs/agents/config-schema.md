venture.config.json drives the entire template: landing page, dashboard nav, features, pricing.
Required top-level: name, tagline, description, domain, flags{waitlistMode,mvpReady}, brand{palette,primary,accent,surface,surfaceLight}
landing: headline, subheadline, painStats[{stat,label}x3], steps[{title,desc}x3], painPoints[6], pricing[3 tiers], finalCta{headline,subheadline}
dashboard.navItems: Dashboard(first,/dashboard,LayoutDashboard) + 2-4 features + Settings(last,/dashboard/settings,Settings)
dashboard.features[]: name, slug, description, table, fields[{name,type,label,required}], crud{create,read,update,delete}, stats[], defaultSort, searchable[]
navItem hrefs MUST match feature slugs exactly
Field types: text, number, boolean, date, select
No placeholder names (Feature1, My Feature, Example)
Pricing MUST match PRD tiers exactly — do not change amounts
painStats must use REAL researched statistics with specific numbers
Table names snake_case, no prefix (prefix added automatically)
Feature slugs kebab-case matching navItem href
