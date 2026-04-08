import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure profile exists (on-demand creation for shared DB)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase.from(`${TABLE_PREFIX}profiles`) as any)
            .select("id")
            .eq("id", user.id)
            .single();

          if (!data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from(`${TABLE_PREFIX}profiles`) as any).insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url || "",
              plan: "free",
            });
          }
        }
      } catch {
        // Profile creation is best-effort — don't block auth
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
