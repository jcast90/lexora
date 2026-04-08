File paths ALWAYS lowercase: @/components/ui/card (NOT Card)
Components PascalCase: import { Card } from "@/components/ui/card"
Icons PascalCase from lucide-react: import { Search, Plus } from "lucide-react"
CRUD: import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db"
Config: import config from "@/lib/config"
Client: import { createClient } from "@/lib/supabase/client"
Installed: avatar, badge, button, card, dialog, dropdown-menu, input, label, select, separator, sheet, table, tabs, textarea
NOT installed: Accordion, Popover, Tooltip, Switch, Checkbox, RadioGroup, Progress, Slider, ScrollArea, Calendar, Form, Toast
Select uses onValueChange NOT onChange
No @radix-ui direct imports — use @/components/ui/
No src/utils/, src/helpers/, src/services/ — use src/lib/
