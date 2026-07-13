import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog-posts";
import { SITE_URL, SITE_NAME } from "@/lib/site";

function IconArrowLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M11 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blogs/${post.slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${SITE_URL}${post.image}`;

  return {
    title: `${post.title} | VIONE Journal`,
    description: post.excerpt,
    keywords: [post.category, ...post.tags],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = sorted.findIndex((p) => p.slug === post.slug);
  const next = sorted.length > 0 ? sorted[(currentIndex + 1) % sorted.length] : null;

  const url = `${SITE_URL}/blogs/${post.slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${SITE_URL}${post.image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    keywords: post.tags.join(", "),
    articleSection: post.category,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.webp` },
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 2, name: post.title, item: url },
    ],
  };

  return (
    <main className="vione-pp">
      <style>{CSS}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="vione-pp-glow" aria-hidden="true" />

      <div className="vione-pp-wrap">
        <Link href="/blogs" className="vione-pp-back">
          <IconArrowLeft />
          Back To The Journal
        </Link>

        <div className="vione-pp-header">
          <span className="vione-pp-category">{post.category}</span>
          <h1 className="vione-pp-title">{post.title}</h1>
          <div className="vione-pp-meta">
            <span>{formatDate(post.date)}</span>
            <span className="vione-pp-dot" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="vione-pp-hero-image">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="vione-pp-img"
            priority
          />
          <div className="vione-pp-hero-overlay" />
        </div>

        <article className="vione-pp-body">
          <p className="vione-pp-lede">{post.excerpt}</p>
          <p>
            This story is still being written — full content for “{post.title}”
            will appear here once it&apos;s added to the journal.
          </p>
        </article>

        {post.tags.length > 0 && (
          <div className="vione-pp-tags" aria-label="Tags">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs/all?tag=${encodeURIComponent(tag)}`}
                className="vione-pp-tag"
              >
                #{tag.replace(/\s+/g, "")}
              </Link>
            ))}
          </div>
        )}

        {next && (
          <div className="vione-pp-next">
            <span className="vione-pp-next-label">Next In The Journal</span>
            <Link href={`/blogs/${next.slug}`} className="vione-pp-next-card">
              <div className="vione-pp-next-info">
                <span className="vione-pp-category">{next.category}</span>
                <h3 className="vione-pp-next-title">{next.title}</h3>
              </div>
              <IconArrowRight />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

const CSS = `
.vione-pp {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 5rem 1.25rem 6rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-pp *, .vione-pp *::before, .vione-pp *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-pp { padding: 6rem 2rem 7rem; } }
@media (min-width: 1024px) { .vione-pp { padding: 7rem 3rem 8rem; } }

.vione-pp-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-pp-glow::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 900px;
  height: 520px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(18,52,35,0.35);
  filter: blur(120px);
}

.vione-pp-wrap {
  position: relative;
  z-index: 1;
  max-width: 46rem;
  margin: 0 auto;
}

.vione-pp-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #A9A296;
  text-decoration: none;
  transition: color 0.3s ease;
}
.vione-pp-back:hover { color: #E4CFA0; }

.vione-pp-header { text-align: center; margin-bottom: 2.5rem; }

.vione-pp-category {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #C9A876;
}

.vione-pp-title {
  margin: 0.85rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.3;
  color: #EDE7D9;
}
@media (min-width: 640px) { .vione-pp-title { font-size: 2.5rem; } }

.vione-pp-meta {
  margin-top: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(201,168,118,0.6);
}
.vione-pp-dot { height: 3px; width: 3px; border-radius: 999px; background: rgba(201,168,118,0.5); }

.vione-pp-hero-image {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(201,168,118,0.15);
  margin-bottom: 2.5rem;
}
.vione-pp-img { object-fit: cover; }
.vione-pp-hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(7,19,14,0.5), transparent 50%);
}

.vione-pp-body {
  font-size: 15.5px;
  line-height: 1.85;
  color: #C7C2B8;
}
.vione-pp-lede {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #EDE7D9;
  margin-bottom: 1.25rem;
}

.vione-pp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 2rem;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(201,168,118,0.12);
}
.vione-pp-tag {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: #C9A876;
  background: rgba(201,168,118,0.08);
  border: 1px solid rgba(201,168,118,0.2);
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.25s ease;
}
.vione-pp-tag:hover {
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  border-color: transparent;
}

.vione-pp-next {
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(201,168,118,0.15);
}
.vione-pp-next-label {
  display: block;
  margin-bottom: 1rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #A9A296;
}
.vione-pp-next-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  text-decoration: none;
  color: #C9A876;
  transition: border-color 0.3s ease, transform 0.3s ease;
}
.vione-pp-next-card:hover {
  border-color: rgba(201,168,118,0.4);
  transform: translateX(4px);
}
.vione-pp-next-title {
  margin: 0.4rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #EDE7D9;
}
`;