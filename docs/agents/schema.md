All tables use venture-specific PREFIX_ (e.g., shopora_). Applied to every table name.
Required base tables: PREFIX_waitlist, PREFIX_profiles, PREFIX_api_keys, PREFIX_page_views
Every product table has: id uuid PK, user_id uuid FK to auth.users, status text, created_at timestamptz, updated_at timestamptz
Use PostgreSQL types: text, integer, numeric(10,2) for money, boolean, jsonb, timestamptz
Add NOT NULL where required, CHECK for enum fields, DEFAULT where sensible
RLS on every table: enable + policies for SELECT/INSERT/UPDATE/DELETE using auth.uid() = user_id
Waitlist: public INSERT (WITH CHECK true), public SELECT
Indexes: on user_id and created_at DESC for every product table
Include update_updated_at_column() trigger function, apply to all tables with updated_at
Schema file: supabase/schema.sql
