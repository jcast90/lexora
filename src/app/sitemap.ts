import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from(`${TABLE_PREFIX}blog_posts`)
      .select("slug,updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const blogRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
