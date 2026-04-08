import { Metadata } from "next";
import Link from "next/link";
import config from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  tags: string[];
  published_at: string;
  author: string;
};

export const metadata: Metadata = {
  title: `Blog | ${config.name}`,
  description: `Latest insights and guides from ${config.name}`,
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from(`${TABLE_PREFIX}blog_posts`)
    .select("slug,title,excerpt,category,tags,published_at,author")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const blogPosts = (posts || []) as BlogPost[];

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Link href="/" className="text-brand-primary hover:underline text-sm mb-4 inline-block">
            &larr; Back to {config.name}
          </Link>
          <h1 className="text-4xl font-bold text-white mt-2">Blog</h1>
          <p className="text-gray-400 mt-2">
            Insights, guides, and updates from the {config.name} team.
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border border-white/10 rounded-lg p-6 hover:border-brand-primary/50 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                    {post.category && (
                      <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-xs font-medium uppercase">
                        {post.category}
                      </span>
                    )}
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </div>
                  <h2 className="text-xl font-semibold text-white hover:text-brand-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mt-2 line-clamp-2">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* JSON-LD: content is admin-controlled from Supabase, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${config.name} Blog`,
            description: `Latest insights from ${config.name}`,
            url: `${config.domain ? `https://${config.domain}` : ""}/blog`,
          }),
        }}
      />
    </main>
  );
}
