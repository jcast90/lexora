CREATE TABLE IF NOT EXISTS lexora_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  plan text NOT NULL DEFAULT 'Free', -- Enum: Free, Pro, Plus
  subscription_status text NOT NULL DEFAULT 'Active', -- Enum: Active, Past Due, Cancelled
  payment_method_last4 text,
  submissions_used int NOT NULL DEFAULT 0,
  templates_count int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lexora_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  practice_area text NOT NULL,
  questions jsonb NOT NULL, -- Array of question objects
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lexora_intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL,
  client_name text NOT NULL,
  contact_email text NOT NULL,
  submission_data jsonb NOT NULL, -- Stores all client answers
  status text NOT NULL DEFAULT 'Submitted', -- Enum: Submitted, In Review, Edited
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lexora_billing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_subscription_id text NOT NULL,
  plan text NOT NULL, -- Free, Pro, Plus
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  billing_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL
);
ALTER TABLE "lexora_templates" ADD CONSTRAINT "fk_lexora_templates_user_id"
  FOREIGN KEY ("user_id") REFERENCES "lexora_users"("id") ON DELETE CASCADE;

ALTER TABLE "lexora_intake_submissions" ADD CONSTRAINT "fk_lexora_intake_submissions_user_id"
  FOREIGN KEY ("user_id") REFERENCES "lexora_users"("id") ON DELETE CASCADE;

ALTER TABLE "lexora_intake_submissions" ADD CONSTRAINT "fk_lexora_intake_submissions_template_id"
  FOREIGN KEY ("template_id") REFERENCES "lexora_templates"("id") ON DELETE SET NULL;

ALTER TABLE "lexora_billing_history" ADD CONSTRAINT "fk_lexora_billing_history_user_id"
  FOREIGN KEY ("user_id") REFERENCES "lexora_users"("id") ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS "lexora_waitlist" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "lexora_api_keys" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS "lexora_waitlist"
  ADD COLUMN IF NOT EXISTS anon_id TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'landing_page',
  ADD COLUMN IF NOT EXISTS experiment_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT;

CREATE TABLE IF NOT EXISTS "lexora_page_views" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  anon_id TEXT,
  experiment_key TEXT,
  variant_key TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "lexora_experiment_assignments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id TEXT NOT NULL,
  experiment_key TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  first_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (experiment_key, anon_id)
);

CREATE TABLE IF NOT EXISTS "lexora_experiment_events" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  anon_id TEXT,
  email TEXT,
  experiment_key TEXT,
  variant_key TEXT,
  page TEXT,
  country TEXT,
  props JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "lexora_page_views_created_at_idx"
  ON "lexora_page_views" (created_at DESC);
CREATE INDEX IF NOT EXISTS "lexora_page_views_experiment_idx"
  ON "lexora_page_views" (experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS "lexora_waitlist_experiment_idx"
  ON "lexora_waitlist" (experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS "lexora_experiment_assignments_lookup_idx"
  ON "lexora_experiment_assignments" (experiment_key, anon_id);
CREATE INDEX IF NOT EXISTS "lexora_experiment_events_created_at_idx"
  ON "lexora_experiment_events" (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS "lexora_experiment_events_experiment_idx"
  ON "lexora_experiment_events" (experiment_key, variant_key, created_at DESC);

ALTER TABLE "lexora_api_keys" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lexora_page_views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lexora_experiment_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lexora_experiment_events" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lexora_api_keys_user_crud" ON "lexora_api_keys";
CREATE POLICY "lexora_api_keys_user_crud" ON "lexora_api_keys" FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lexora_page_views_public_insert" ON "lexora_page_views";
CREATE POLICY "lexora_page_views_public_insert" ON "lexora_page_views" FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "lexora_experiment_assignments_public_access" ON "lexora_experiment_assignments";
CREATE POLICY "lexora_experiment_assignments_public_access" ON "lexora_experiment_assignments" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "lexora_experiment_events_public_access" ON "lexora_experiment_events";
CREATE POLICY "lexora_experiment_events_public_access" ON "lexora_experiment_events" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "lexora_experiment_assignments_updated_at" ON "lexora_experiment_assignments";
CREATE TRIGGER "lexora_experiment_assignments_updated_at"
  BEFORE UPDATE ON "lexora_experiment_assignments"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS "lexora_blog_posts" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Editorial Team',
  meta_title TEXT,
  meta_description TEXT,
  target_keyword TEXT,
  secondary_keywords TEXT[],
  faq JSONB DEFAULT '[]'::jsonb,
  key_takeaways TEXT[],
  category TEXT,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  related_slugs TEXT[],
  cta_type TEXT DEFAULT 'waitlist',
  seo_week_number INTEGER,
  generation_cost_usd REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "lexora_blog_posts_slug_idx"
  ON "lexora_blog_posts" (slug);
CREATE INDEX IF NOT EXISTS "lexora_blog_posts_status_published_idx"
  ON "lexora_blog_posts" (status, published_at DESC);

ALTER TABLE "lexora_blog_posts" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lexora_blog_posts_public_read" ON "lexora_blog_posts";
CREATE POLICY "lexora_blog_posts_public_read" ON "lexora_blog_posts" FOR SELECT TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "lexora_blog_posts_service_all" ON "lexora_blog_posts";
CREATE POLICY "lexora_blog_posts_service_all" ON "lexora_blog_posts" FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Ensure prefixed profiles table exists (template has unprefixed 'profiles',
-- but incubator pattern requires prefixed tables)
CREATE TABLE IF NOT EXISTS "lexora_profiles" (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure profiles table has email column (for Stripe webhook user lookup)
ALTER TABLE IF EXISTS "lexora_profiles"
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user_lexora()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."lexora_profiles" (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS "on_auth_user_created_lexora" ON auth.users;
CREATE TRIGGER "on_auth_user_created_lexora"
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_lexora();

ALTER TABLE IF EXISTS "lexora_profiles" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lexora_profiles_select_own" ON "lexora_profiles";
CREATE POLICY "lexora_profiles_select_own" ON "lexora_profiles" FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "lexora_profiles_update_own" ON "lexora_profiles";
CREATE POLICY "lexora_profiles_update_own" ON "lexora_profiles" FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "lexora_profiles_service_role" ON "lexora_profiles";
CREATE POLICY "lexora_profiles_service_role" ON "lexora_profiles" FOR ALL TO service_role USING (true) WITH CHECK (true);
