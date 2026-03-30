import { notFound } from 'next/navigation';
import { SchoolHub } from './SchoolHub';
import { SportsTeamJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SchoolPageProps) {
  const { slug } = await params;
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data } = await supabase
    .from('schools')
    .select('name, conference, mascot')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'School' };

  const title = `${data.name} Football | Fans, Takes & Transfer Portal`;
  const description = `${data.name} ${data.mascot ?? ''} college football community. Join the conversation, track portal moves, debate rivalries, and represent your school.`.trim();

  return {
    title,
    description,
    openGraph: {
      title: `${data.name} | CFB Social`,
      description,
    },
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Fetch school
  const { data: school, error } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !school) notFound();

  // Fetch fan count
  const { count: fanCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', school.id);

  // Fetch post count
  const { count: postCount } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', school.id)
    .eq('status', 'PUBLISHED');

  // Fetch recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(
        id, username, display_name, avatar_url, school_id, dynasty_tier
      ),
      school:schools!posts_school_id_fkey(
        id, name, abbreviation, primary_color, secondary_color, logo_url, slug
      )
    `)
    .eq('school_id', school.id)
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch top fans by XP
  const { data: topFans } = await supabase
    .from('profiles')
    .select('username, display_name, xp, dynasty_tier, post_count')
    .eq('school_id', school.id)
    .order('xp', { ascending: false })
    .limit(10);

  // Fetch portal players for this school
  const { count: portalCount } = await supabase
    .from('portal_players')
    .select('id', { count: 'exact', head: true })
    .or(`previous_school_id.eq.${school.id},committed_school_id.eq.${school.id}`);

  return (
    <>
      <SportsTeamJsonLd
        name={school.name}
        conference={school.conference}
        mascot={school.mascot}
        url={`https://cfbsocial.com/school/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://cfbsocial.com' },
          { name: 'Schools', url: 'https://cfbsocial.com/feed' },
          { name: school.name, url: `https://cfbsocial.com/school/${slug}` },
        ]}
      />
      <SchoolHub
        school={school}
        fanCount={fanCount ?? 0}
        postCount={postCount ?? 0}
        portalCount={portalCount ?? 0}
        posts={posts ?? []}
        topFans={topFans ?? []}
      />
    </>
  );
}
