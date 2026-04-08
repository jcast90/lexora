import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import config from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";

type FaqEntry = { question: string; answer: string };

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  target_keyword: string | null;
  secondary_keywords: string[];
  faq: FaqEntry[];
  key_takeaways: string[];
  category: string | null;
  tags: string[];
  published_at: string;
  related_slugs: string[];
  cta_type: string;
};

type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
};

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from(`${TABLE_PREFIX}blog_posts`)
      .select("slug")
      .eq("status", "published");
    return (data || []).map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from(`${TABLE_PREFIX}blog_posts`)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return {};

  const baseUrl = config.domain ? `https://${config.domain}` : "";

  return {
    title: post.meta_title || `${post.title} | ${config.name}`,
    description: post.meta_description || post.excerpt,
    keywords: [post.target_keyword, ...(post.secondary_keywords || [])].filter(Boolean).join(", "),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
      url: `${baseUrl}/blog/${post.slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderMarkdown(content: string): string {
  // Note: content comes from admin-controlled Supabase blog_posts table, not user input
  let html = content
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-white/5 rounded-lg p-4 overflow-x-auto my-4"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mt-10 mb-4">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-primary hover:underline">$1</a>')
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-8" />')
    .replace(/^(?!<[a-z])((?!\s*$).+)$/gm, '<p class="text-gray-300 leading-relaxed mb-4">$1</p>');

  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, '<ul class="list-disc space-y-1 mb-4 text-gray-300">$1</ul>');

  return html;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from(`${TABLE_PREFIX}blog_posts`)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const typedPost = post as BlogPost;

  let relatedPosts: RelatedPost[] = [];
  if (typedPost.related_slugs?.length) {
    const { data } = await supabase
      .from(`${TABLE_PREFIX}blog_posts`)
      .select("slug,title,excerpt")
      .in("slug", typedPost.related_slugs)
      .eq("status", "published");
    relatedPosts = (data || []) as RelatedPost[];
  }

  const baseUrl = config.domain ? `https://${config.domain}` : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: typedPost.title,
    description: typedPost.excerpt,
    author: { "@type": "Person", name: typedPost.author },
    datePublished: typedPost.published_at,
    keywords: [typedPost.target_keyword, ...(typedPost.secondary_keywords || [])].filter(Boolean).join(", "),
    publisher: { "@type": "Organization", name: config.name },
    mainEntityOfPage: `${baseUrl}/blog/${typedPost.slug}`,
  };

  const faqSchema =
    typedPost.faq?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: typedPost.faq.map((f: FaqEntry) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl || "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: typedPost.title },
    ],
  };

  return (
    <main className="min-h-screen bg-brand-surface">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-[200px]">{typedPost.title}</span>
        </nav>

        <header className="mb-10">
          {typedPost.category && (
            <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-xs font-medium uppercase">
              {typedPost.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3">{typedPost.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <span>{typedPost.author}</span>
            <span>&middot;</span>
            <time dateTime={typedPost.published_at}>{formatDate(typedPost.published_at)}</time>
          </div>
        </header>

        {typedPost.key_takeaways?.length > 0 && (
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-5 mb-10">
            <h2 className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-3">Key Takeaways</h2>
            <ul className="space-y-2">
              {typedPost.key_takeaways.map((takeaway: string, i: number) => (
                <li key={i} className="flex gap-2 text-gray-300 text-sm">
                  <span className="text-brand-primary mt-0.5 shrink-0">&#10003;</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Markdown content from admin-controlled Supabase blog_posts table */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(typedPost.content) }}
        />

        {typedPost.faq?.length > 0 && (
          <section className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {typedPost.faq.map((faq: FaqEntry, i: number) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="text-gray-400 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {typedPost.cta_type === "waitlist" ? `Join the ${config.name} waitlist` : `Try ${config.name} today`}
          </h2>
          <p className="text-gray-400 mb-4">{config.tagline}</p>
          <Link
            href={typedPost.cta_type === "waitlist" ? "/#waitlist" : "/signup"}
            className="inline-block bg-brand-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {typedPost.cta_type === "waitlist" ? "Join Waitlist" : "Get Started"}
          </Link>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="border border-white/10 rounded-lg p-4 hover:border-brand-primary/50 transition-colors"
                >
                  <h3 className="text-white font-medium">{rp.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{rp.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD schemas: content is admin-controlled from Supabase, not user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
