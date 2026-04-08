Dashboard pages start with "use client";
USE @/components/blocks for all page structure — do NOT write raw Tailwind for layout/cards/tables/forms.
useState + useEffect for Supabase data via getRows/insertRow/updateRow/deleteRow
try/catch with realistic sample data fallback (3-5 rows matching product domain)
Stats: <StatsGrid stats={[...]} /> — pass array of { title, value, change, trend, icon }
Search: <SearchInput value={search} onChange={...} />
Table: <DataTable columns={columns} data={filtered} /> — define Column[] with render functions
Create/Edit: <FormDialog open={...} onOpenChange={...} title={...} onSubmit={...}> with <FormField> + <ThemedInput>
Primary buttons: <GradientButton icon={Plus}>Create</GradientButton>
Status display: <StatusBadge status="active" /> (success|warning|error|pending|completed|active|inactive)
Loading: <LoadingState />
Empty: <EmptyState title="No items yet" action={<GradientButton>Create</GradientButton>} />
Page wrapper: <PageShell><PageHeader title="..." description="..." action={...} />...</PageShell>
Every button must be functional — no placeholder onClick or # hrefs
Export default function — never export const
File placement: src/app/dashboard/[feature]/page.tsx
