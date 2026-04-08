# CRUD Page Pattern (using blocks)

A complete dashboard page using pre-built blocks. Copy and adapt.

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  PageShell,
  PageHeader,
  StatsGrid,
  SearchInput,
  DataTable,
  FormDialog,
  FormField,
  ThemedInput,
  GradientButton,
  StatusBadge,
  LoadingState,
  EmptyState,
} from "@/components/blocks";
import type { Column } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

interface Item {
  id: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
}

const SAMPLE: Item[] = [
  { id: "1", name: "Sample Item", status: "active", created_at: new Date().toISOString() },
  { id: "2", name: "Another Item", status: "inactive", created_at: new Date().toISOString() },
];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [formName, setFormName] = useState("");

  async function load() {
    try {
      const rows = await getRows<Item>("items", { orderBy: "created_at" });
      setItems(rows.length > 0 ? rows : SAMPLE);
    } catch {
      setItems(SAMPLE);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (editItem) {
      await updateRow("items", editItem.id, { name: formName });
    } else {
      await insertRow("items", { name: formName, status: "active" });
    }
    setDialogOpen(false);
    setEditItem(null);
    setFormName("");
    load();
  }

  async function handleDelete(id: string) {
    await deleteRow("items", id);
    load();
  }

  function openEdit(item: Item) {
    setEditItem(item);
    setFormName(item.name);
    setDialogOpen(true);
  }

  if (loading) return <LoadingState />;

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { title: "Total Items", value: String(items.length), icon: Package },
    { title: "Active", value: String(items.filter((i) => i.status === "active").length) },
    { title: "Inactive", value: String(items.filter((i) => i.status === "inactive").length) },
  ];

  const columns: Column<Item>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => <span className="font-medium text-white/80">{row.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "created_at",
      header: "Created",
      render: (row) => (
        <span className="text-white/40">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="space-x-1">
          <Button variant="ghost" size="icon-xs" onClick={() => openEdit(row)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(row.id)}>
            <Trash2 className="size-3.5 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Items"
        description="Manage your items."
        action={
          <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>
            Create
          </GradientButton>
        }
      />

      <StatsGrid stats={stats} />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items..."
        containerClassName="mb-4"
      />

      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <EmptyState
          icon={Package}
          title="No items found"
          description={search ? "Try a different search term." : "Create your first item to get started."}
          action={
            !search ? (
              <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>
                Create Item
              </GradientButton>
            ) : undefined
          }
        />
      )}

      <FormDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) { setEditItem(null); setFormName(""); }
        }}
        title={editItem ? "Edit Item" : "Create Item"}
        onSubmit={handleSave}
      >
        <FormField label="Name">
          <ThemedInput
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter item name..."
          />
        </FormField>
      </FormDialog>
    </PageShell>
  );
}
```

## Key patterns

- **Stats**: Pass array to `<StatsGrid>`. First card auto-highlighted.
- **Search + Table**: `<SearchInput>` + `<DataTable columns={...} data={filtered}>`. Define `Column[]` with `render` functions.
- **Create/Edit Dialog**: Single `<FormDialog>` toggled via `editItem` state. Contains `<FormField>` + `<ThemedInput>`.
- **Empty state**: `<EmptyState>` with optional action button.
- **Loading**: `<LoadingState />` — no props needed.
- **Status display**: `<StatusBadge status="active" />` — supports: success, warning, error, pending, completed, active, inactive, info, neutral.
- **Primary buttons**: `<GradientButton icon={Plus}>Create</GradientButton>`.
- **Page structure**: Always `<PageShell><PageHeader ... />...content...</PageShell>`.

## Other blocks for non-CRUD pages

- `<SectionCard title="..." description="...">` — titled card section
- `<ThemedCard>` — plain dark card
- `<ListItem>` — bordered row for settings lists
- `<ProgressBar label="Requests" value={12847} max={50000} />` — usage bars
- `<QuickAction icon={Plus} label="Create Project" onClick={...} />` — action row
- `<IconBox icon={Users} variant="brand" />` — icon in a colored box
