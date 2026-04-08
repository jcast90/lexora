import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = await cookies();

  if (!url || !key) {
    // Build-time: allow static generation with a non-functional client
    return createServerClient("https://placeholder.supabase.co", "placeholder", {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored in Server Components — only works in Route Handlers/Server Actions
        }
      },
    },
  });
}
