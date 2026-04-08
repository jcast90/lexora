import { NextRequest, NextResponse } from "next/server";
import { inngest, ventureEvent } from "@/lib/inngest";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";

async function posthogCapture(event: string, payload: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  if (!key) return;

  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: String(payload.anon_id || payload.email || "anonymous"),
        properties: payload,
      }),
    });
  } catch {
    // Ignore analytics failures
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      anonId,
      experimentKey,
      variantKey,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
    } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const payload = {
      email,
      anon_id: anonId || null,
      source: "landing_page",
      experiment_key: experimentKey || null,
      variant_key: variantKey || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      referrer: referrer || null,
    };

    const { error } = await supabase.from(`${TABLE_PREFIX}waitlist`).insert([payload]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from(`${TABLE_PREFIX}experiment_events`).insert([{
      event_name: "waitlist_signup_succeeded",
      page: "/",
      props: payload,
      ...payload,
    }]);

    await posthogCapture("waitlist_signup_succeeded", payload);

    await inngest.send({
      name: ventureEvent("user.signup"),
      data: { email },
    });

    return NextResponse.json({ message: "Success" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
