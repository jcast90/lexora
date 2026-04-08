PREFER blocks over raw Tailwind. Import from "@/components/blocks".

Available blocks:
- PageShell — page wrapper (replaces px-4 py-8 div)
- PageHeader — title + description + optional action
- StatsGrid — row of StatCards (pass stats array)
- StatCard — single metric (title, value, change, trend, icon)
- SearchInput — input with search icon
- DataTable — themed table in card (pass columns + data)
- ThemedCard — card with dark styling
- SectionCard — titled card section (title, description, action, children)
- FormDialog — create/edit dialog (open, onOpenChange, title, onSubmit, children)
- FormField — label + children wrapper
- ThemedInput — input with dark styling
- GradientButton — brand gradient button (optional icon prop)
- StatusBadge — status badge (status: success|warning|error|pending|completed|active|inactive|info|neutral)
- LoadingState — full-area spinner
- EmptyState — centered empty state (icon, title, description, action)
- IconBox — icon container (variant: muted|brand|success|danger|warning)
- ListItem — bordered row for lists
- ProgressBar — usage bar (label, value, max)
- QuickAction — icon + label button row

Example page:
```tsx
"use client";
import { useEffect, useState } from "react";
import { PageShell, PageHeader, StatsGrid, SearchInput, DataTable, FormDialog, FormField, ThemedInput, GradientButton, StatusBadge, LoadingState, EmptyState } from "@/components/blocks";
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Column } from "@/components/blocks";
```

DataTable columns:
```tsx
const columns: Column<Item>[] = [
  { key: "name", header: "Name", render: (row) => <span className="text-white/80">{row.name}</span> },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "id", header: "Actions", align: "right", render: (row) => (
    <>
      <Button variant="ghost" size="icon-xs" onClick={() => edit(row)}><Pencil className="size-3.5" /></Button>
      <Button variant="ghost" size="icon-xs" onClick={() => del(row.id)}><Trash2 className="size-3.5 text-red-400" /></Button>
    </>
  )},
];
```
