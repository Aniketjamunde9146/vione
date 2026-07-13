import { createClient } from "@/lib/supabase/client";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
};

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  image: string;
  tags: string[] | null;
};

function mapRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    readTime: row.read_time,
    image: row.image,
    tags: row.tags ?? [],
  };
}

/**
 * All blog posts, newest first.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("getAllPosts error:", error.message);
    return [];
  }

  return (data as BlogRow[]).map(mapRow);
}

/**
 * The single most recent post — used as the featured/hero post.
 */
export async function getLatestPost(): Promise<BlogPost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getLatestPost error:", error.message);
    return null;
  }

  return data ? mapRow(data as BlogRow) : null;
}

/**
 * All posts except the latest one, newest first — used for the
 * "more posts" grid under the featured post.
 */
export async function getOtherPosts(): Promise<BlogPost[]> {
  const supabase = createClient();

  const latest = await getLatestPost();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("getOtherPosts error:", error.message);
    return [];
  }

  const posts = (data as BlogRow[]).map(mapRow);

  if (!latest) return posts;
  return posts.filter((p) => p.id !== latest.id);
}

/**
 * A single post by slug — used for /blogs/[slug] detail pages.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getPostBySlug error:", error.message);
    return null;
  }

  return data ? mapRow(data as BlogRow) : null;
}

/**
 * Every unique tag across all posts, in first-seen order.
 */
export async function getAllTags(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("blogs").select("tags");

  if (error) {
    console.error("getAllTags error:", error.message);
    return [];
  }

  const rows = data as { tags: string[] | null }[];
  return Array.from(new Set(rows.flatMap((r) => r.tags ?? [])));
}

/**
 * Every unique category across all posts — handy for filter chips.
 */
export async function getAllCategories(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("blogs").select("category");

  if (error) {
    console.error("getAllCategories error:", error.message);
    return [];
  }

  const rows = data as { category: string }[];
  return Array.from(new Set(rows.map((r) => r.category)));
}