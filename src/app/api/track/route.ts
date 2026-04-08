import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX ?? "";
const PAGE_VIEWS_TABLE = `${TABLE_PREFIX}page_views`;
const ASSIGNMENTS_TABLE = `${TABLE_PREFIX}experiment_assignments`;
const EVENTS_TABLE = `${TABLE_PREFIX}experiment_events`;

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

const recent = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of recent) {
    if (now - ts > RATE_LIMIT_MS) recent.delete(key);
  }
}, 10 * 60 * 1000).unref?.();

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

type TrackBody = {
  page?: string;
  referrer?: string | null;
  ua?: string | null;
  anonId?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  experimentKey?: string | null;
  variantKey?: string | null;
};

export async function POST(req: NextRequest) {
  let body: TrackBody;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const page = body.page;
  if (!page || typeof page !== "string") {
    return new Response(null, { status: 400 });
  }

  const ip = getClientIP(req);
  const rateKey = `${ip}:${page}`;
  const now = Date.now();
  const last = recent.get(rateKey);

  if (last && now - last < RATE_LIMIT_MS) {
    return new Response(null, { status: 204 });
  }
  recent.set(rateKey, now);

  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    null;

  const supabase = getSupabase();
  if (!supabase) return new Response(null, { status: 204 });

  const eventContext = {
    anon_id: body.anonId || null,
    experiment_key: body.experimentKey || null,
    variant_key: body.variantKey || null,
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from(PAGE_VIEWS_TABLE) as any)
    .insert({
      page,
      referrer: body.referrer || null,
      user_agent: body.ua || null,
      country,
      ...eventContext,
    })
    .then(({ error }: { error: { message: string } | null }) => {
      if (error) console.error("[track] page_view insert error:", error.message);
    });

  if (body.experimentKey && body.variantKey && body.anonId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from(ASSIGNMENTS_TABLE) as any)
      .upsert({
        anon_id: body.anonId,
        experiment_key: body.experimentKey,
        variant_key: body.variantKey,
        first_page: page,
      }, { onConflict: "experiment_key,anon_id" })
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) console.error("[track] assignment upsert error:", error.message);
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from(EVENTS_TABLE) as any)
      .insert({
        event_name: page === "/" ? "landing_page_view" : "page_view",
        page,
        country,
        props: eventContext,
        ...eventContext,
      })
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) console.error("[track] experiment event insert error:", error.message);
      });
  }

  return new Response(null, { status: 204 });
}
