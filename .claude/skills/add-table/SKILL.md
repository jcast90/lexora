---
name: add-table
description: Generate a Supabase table with RLS policies. Use when adding a database table for a feature.
invocation: user
---

Create a new Supabase table. The user provides the table name as an argument (e.g., `/add-table contacts`).

## Steps

1. **Read `supabase/schema.sql`** to understand existing tables and conventions
2. **Append to `supabase/schema.sql`** with the new table:

```sql
CREATE TABLE IF NOT EXISTS $ARGUMENTS (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- add feature-specific columns here
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE $ARGUMENTS ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rows" ON $ARGUMENTS
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rows" ON $ARGUMENTS
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rows" ON $ARGUMENTS
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rows" ON $ARGUMENTS
    FOR DELETE USING (auth.uid() = user_id);
```

3. **Ask the user** what columns the table needs (or infer from context)
4. **Use CHECK constraints** for enum-like columns (e.g., `status TEXT CHECK (status IN ('active', 'inactive'))`)
5. **Always include**: UUID primary key, `user_id` FK, `created_at`, RLS enabled with 4 policies

## Rules
- Table names are lowercase with underscores
- Always enable RLS — never skip this
- Always add user_id if data is user-specific
- Use `gen_random_uuid()` not `uuid_generate_v4()`
