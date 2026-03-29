import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://cfbsocial.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${BASE_URL}/feed`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${BASE_URL}/rivalry`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/portal`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/predictions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/war-room`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE_URL}/mascot-wars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/recruiting`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/dynasty`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/hall-of-fame`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${BASE_URL}/vault`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ];

  // Dynamic school pages (653 schools)
  const { data: schools } = await supabase
    .from('schools')
    .select('slug, updated_at')
    .not('slug', 'is', null);

  const schoolPages: MetadataRoute.Sitemap = (schools ?? []).map((school) => ({
    url: `${BASE_URL}/school/${school.slug}`,
    lastModified: school.updated_at ? new Date(school.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Dynamic post pages (latest 1000 published posts)
  const { data: posts } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(1000);

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/post/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...schoolPages, ...postPages];
}
