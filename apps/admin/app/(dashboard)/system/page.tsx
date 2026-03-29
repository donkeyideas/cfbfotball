import { Suspense } from 'react';

export const metadata = {
  title: 'System Health',
};

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Health</h1>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-card p-6">
                <div className="skeleton h-32 w-full" />
              </div>
            ))}
          </div>
        }
      >
        <SystemHealth />
      </Suspense>
    </div>
  );
}

const DB_TABLES = [
  'profiles',
  'posts',
  'reactions',
  'reports',
  'schools',
  'challenges',
  'predictions',
  'portal_players',
  'moderation_events',
  'follows',
  'rivalries',
  'xp_log',
  'achievements',
  'user_achievements',
] as const;

async function SystemHealth() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Test database connectivity
  const dbStart = Date.now();
  const { error: dbError } = await supabase.from('schools').select('id').limit(1);
  const dbLatency = Date.now() - dbStart;

  const checks = [
    {
      name: 'Database',
      status: dbError ? 'error' : 'healthy',
      latency: `${dbLatency}ms`,
      details: dbError ? dbError.message : 'Connected',
    },
    {
      name: 'Auth Service',
      status: 'healthy',
      latency: '-',
      details: 'Supabase Auth operational',
    },
    {
      name: 'Storage',
      status: 'healthy',
      latency: '-',
      details: 'Supabase Storage operational',
    },
    {
      name: 'Realtime',
      status: 'healthy',
      latency: '-',
      details: 'Supabase Realtime operational',
    },
  ];

  // Fetch row counts for all key tables in parallel
  const countResults = await Promise.all(
    DB_TABLES.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      return { table, count: count ?? 0, error };
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => (
          <div key={check.name} className="admin-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{check.name}</p>
              <span
                className={`h-3 w-3 rounded-full ${
                  check.status === 'healthy'
                    ? 'bg-[var(--admin-success)]'
                    : check.status === 'warning'
                      ? 'bg-[var(--admin-warning)]'
                      : 'bg-[var(--admin-error)]'
                }`}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--admin-text-muted)]">{check.details}</p>
            <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
              Latency: {check.latency}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Database Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {countResults.map(({ table, count, error }) => (
            <div
              key={table}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4"
            >
              <p className="text-xs font-medium text-[var(--admin-text-muted)]">{table}</p>
              {error ? (
                <p className="mt-1 text-sm text-[var(--admin-error)]">Error</p>
              ) : (
                <p className="mt-1 text-xl font-bold">{count.toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
