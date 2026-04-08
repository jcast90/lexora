# Component Reference

Quick reference for props and variants. See AGENTS.md for import statements.

## Button
- Variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
- Sizes: `default`, `sm`, `lg`, `icon`, `xs`, `icon-xs`, `icon-sm`, `icon-lg`

## Badge
- Variants: `default`, `secondary`, `destructive`, `outline`

## Card
- Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- Always: `className="border-white/[0.06] bg-brand-surface-light text-white"`

## Dialog
- Sub-components: `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`

## Select
- Sub-components: `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- Use `onValueChange` on root `<Select>` — NOT `onChange`

## Table
- Sub-components: `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`
- Headers: `text-white/40` — Rows: `border-white/[0.06] hover:bg-white/[0.03]`

## Tabs
- Sub-components: `TabsList`, `TabsTrigger`, `TabsContent`

## Sheet
- Sub-components: `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`

## Input / Textarea / Label
- Input style: `className="bg-white/5 border-white/10"`
- Always pair Label with form fields

## Avatar
- Sub-components: `AvatarImage`, `AvatarFallback`

## Separator / DropdownMenu
- Separator: `className="bg-white/[0.06]"`
- DropdownMenu: `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`
