import { Suspense } from 'react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ActivityChart } from '@/components/dashboard/ActivityChart';

export const metadata = {
  title: 'Overview',
};

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card p-6">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton mt-2 h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="admin-card p-6">
        <div className="skeleton h-64 w-full" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <Suspense fallback={<OverviewSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Fetch aggregate stats
  const [usersResult, postsResult, flaggedResult, reactionsResult, reportsResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'FLAGGED'),
    supabase.from('reactions').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
  ]);

  const stats = [
    {
      label: 'Total Users',
      value: usersResult.count ?? 0,
      trend: 'up' as const,
      change: 0,
    },
    {
      label: 'Published Posts',
      value: postsResult.count ?? 0,
      trend: 'up' as const,
      change: 0,
    },
    {
      label: 'Total Reactions',
      value: reactionsResult.count ?? 0,
      trend: 'up' as const,
      change: 0,
    },
    {
      label: 'Flagged Posts',
      value: flaggedResult.count ?? 0,
      trend: (flaggedResult.count ?? 0) > 0 ? ('up' as const) : ('neutral' as const),
      change: 0,
    },
  ];

  // Build activity data for the last 7 days
  const days: { date: string; posts: number; reactions: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      posts: 0,
      reactions: 0,
    });
  }

  // Fetch posts from last 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .eq('status', 'PUBLISHED');

  if (recentPosts) {
    for (const post of recentPosts) {
      const postDate = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const day = days.find((d) => d.date === postDate);
      if (day) day.posts++;
    }
  }

  // Fetch reactions from last 7 days
  const { data: recentReactions } = await supabase
    .from('reactions')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (recentReactions) {
    for (const reaction of recentReactions) {
      const rDate = new Date(reaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const day = days.find((d) => d.date === rDate);
      if (day) day.reactions++;
    }
  }

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />

      {/* Activity chart */}
      <div className="admin-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--admin-text)]">
          Activity — Last 7 Days
        </h2>
        <ActivityChart data={days} />
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="admin-card p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Pending Reports
          </h3>
          <p className="text-4xl font-bold text-[var(--admin-warning)]">
            {(reportsResult.count ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">Awaiting review</p>
        </div>
        <div className="admin-card p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Flagged Content
          </h3>
          <p className="text-4xl font-bold text-[var(--admin-error)]">
            {(flaggedResult.count ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--admin-text-muted)]">In moderation queue</p>
        </div>
      </div>
    </div>
  );
}
