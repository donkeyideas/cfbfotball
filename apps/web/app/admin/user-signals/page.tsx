import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/admin/shared/loading-skeleton';
import { StatCard } from '@/components/admin/shared/stat-card';
import { ChartWrapper } from '@/components/admin/shared/chart-wrapper';
import { Activity, Eye, Clock, Monitor, MousePointerClick, Layers } from 'lucide-react';

export const metadata = { title: 'User Signals - CFB Admin' };
export const dynamic = 'force-dynamic';

export default function UserSignalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--admin-serif)' }}>User Signals</h1>
        <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
          Behavioral event tracking for future algorithm training data
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton type="cards" rows={6} />}>
        <SignalStats />
      </Suspense>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<LoadingSkeleton type="chart" />}>
          <EventTypeBreakdown />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton type="chart" />}>
          <DwellTimeCard />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSkeleton type="chart" />}>
        <HourlyActivityChart />
      </Suspense>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<LoadingSkeleton type="table" />}>
          <TopContentCard />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton type="table" />}>
          <RecentEventsCard />
        </Suspense>
      </div>
    </div>
  );
}

async function SignalStats() {
  const { getSignalsSummary } = await import('@/lib/admin/actions/user-signals');
  const s = await getSignalsSummary();
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <StatCard label="Total Events" value={s.totalEvents} icon={Activity} />
      <StatCard label="Events Today" value={s.eventsToday} icon={MousePointerClick} />
      <StatCard label="Events (24h)" value={s.events24h} icon={Eye} />
      <StatCard label="Events (7d)" value={s.events7d} icon={Layers} />
      <StatCard label="Sessions (24h)" value={s.uniqueSessions24h} icon={Monitor} />
    </div>
  );
}

async function EventTypeBreakdown() {
  const { getEventTypeBreakdown } = await import('@/lib/admin/actions/user-signals');
  const breakdown = await getEventTypeBreakdown(24);

  const total = breakdown.reduce((s, e) => s + e.count, 0);

  return (
    <ChartWrapper title="Event Types (24h)" subtitle="Distribution of tracked user events">
      {breakdown.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--admin-text-muted)]">No events recorded yet. Events will appear here once users interact with the platform.</p>
      ) : (
        <div className="space-y-3">
          {breakdown.map((e) => {
            const pct = total > 0 ? (e.count / total) * 100 : 0;
            return (
              <div key={e.event_type} className="flex items-center gap-3">
                <span className="w-36 text-xs text-[var(--admin-text-secondary)]" style={{ fontFamily: 'var(--admin-mono)' }}>
                  {e.event_type}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--admin-surface-raised)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--admin-accent)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 text-right text-xs text-[var(--admin-text-muted)]">{e.count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      )}
    </ChartWrapper>
  );
}

async function DwellTimeCard() {
  const { getDwellTimeStats } = await import('@/lib/admin/actions/user-signals');
  const dwell = await getDwellTimeStats();

  const formatMs = (ms: number) => {
    if (ms === 0) return '0s';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <ChartWrapper title="Dwell Time (24h)" subtitle="How long users spend viewing content">
      {dwell.totalEvents === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--admin-text-muted)]">No dwell time data yet. This tracks time spent viewing posts.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 py-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[var(--admin-text)]" style={{ fontFamily: 'var(--admin-serif)' }}>
              {formatMs(dwell.avgDwellMs)}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">Average Dwell</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--admin-text)]" style={{ fontFamily: 'var(--admin-serif)' }}>
              {formatMs(dwell.medianDwellMs)}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">Median Dwell</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--admin-text)]" style={{ fontFamily: 'var(--admin-serif)' }}>
              {dwell.totalEvents.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">Samples</p>
          </div>
        </div>
      )}
    </ChartWrapper>
  );
}

async function HourlyActivityChart() {
  const { getHourlyActivity } = await import('@/lib/admin/actions/user-signals');
  const hourly = await getHourlyActivity(24);

  const maxCount = Math.max(...hourly.map((h) => h.count), 1);

  return (
    <ChartWrapper title="Hourly Activity (24h)" subtitle="Event volume by hour">
      {hourly.every((h) => h.count === 0) ? (
        <p className="py-8 text-center text-sm text-[var(--admin-text-muted)]">No activity data yet.</p>
      ) : (
        <div className="flex items-end gap-1" style={{ height: '140px' }}>
          {hourly.map((h) => {
            const height = maxCount > 0 ? (h.count / maxCount) * 100 : 0;
            return (
              <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[var(--admin-accent)]"
                  style={{ height: `${Math.max(height, 2)}%`, minHeight: '2px', opacity: h.count > 0 ? 1 : 0.2 }}
                  title={`${h.hour}: ${h.count} events`}
                />
                <span className="text-[8px] text-[var(--admin-text-muted)]" style={{ writingMode: 'vertical-lr' }}>
                  {h.hour}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </ChartWrapper>
  );
}

async function TopContentCard() {
  const { getTopContent } = await import('@/lib/admin/actions/user-signals');
  const topContent = await getTopContent(24);

  const formatMs = (ms: number) => {
    if (ms === 0) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="admin-card p-6">
      <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]" style={{ fontFamily: 'var(--admin-serif)' }}>
        Top Content (24h)
      </h3>
      <p className="mb-4 text-xs text-[var(--admin-text-muted)]">Most viewed targets by event count</p>

      {topContent.length === 0 ? (
        <p className="py-4 text-center text-sm text-[var(--admin-text-muted)]">No content signals yet.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            <span className="w-16">Type</span>
            <span className="flex-1">Target</span>
            <span className="w-12 text-right">Views</span>
            <span className="w-14 text-right">Dwell</span>
          </div>
          {topContent.slice(0, 10).map((c, i) => (
            <div key={i} className="flex items-center gap-2 border-t border-[var(--admin-border)] py-1.5">
              <span className="w-16 text-xs text-[var(--admin-accent)]" style={{ fontFamily: 'var(--admin-mono)' }}>
                {c.target}
              </span>
              <span className="flex-1 truncate text-xs text-[var(--admin-text-secondary)]" style={{ fontFamily: 'var(--admin-mono)' }}>
                {c.target_id.slice(0, 12)}...
              </span>
              <span className="w-12 text-right text-xs font-semibold text-[var(--admin-text)]">
                {c.views}
              </span>
              <span className="w-14 text-right text-xs text-[var(--admin-text-muted)]">
                {formatMs(c.total_dwell_ms)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function RecentEventsCard() {
  const { getRecentEvents } = await import('@/lib/admin/actions/user-signals');
  const events = await getRecentEvents(20);

  return (
    <div className="admin-card p-6">
      <h3 className="mb-1 text-base font-semibold text-[var(--admin-text)]" style={{ fontFamily: 'var(--admin-serif)' }}>
        Recent Events
      </h3>
      <p className="mb-4 text-xs text-[var(--admin-text-muted)]">Live feed of latest tracked signals</p>

      {events.length === 0 ? (
        <p className="py-4 text-center text-sm text-[var(--admin-text-muted)]">No events recorded yet.</p>
      ) : (
        <div className="space-y-1.5 max-h-80 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {events.map((e: { id: string; event_type: string; event_target: string | null; target_id: string | null; created_at: string; duration_ms: number | null }) => (
            <div key={e.id} className="flex items-center gap-2 border-t border-[var(--admin-border)] py-1.5">
              <span className="shrink-0 text-xs text-[var(--admin-accent)]" style={{ fontFamily: 'var(--admin-mono)' }}>
                {e.event_type}
              </span>
              <span className="flex-1 truncate text-[10px] text-[var(--admin-text-muted)]">
                {e.event_target ? `${e.event_target}${e.target_id ? `:${e.target_id.slice(0, 8)}` : ''}` : ''}
              </span>
              {e.duration_ms && (
                <span className="text-[10px] text-[var(--admin-text-muted)]">
                  {(e.duration_ms / 1000).toFixed(1)}s
                </span>
              )}
              <span className="shrink-0 text-[10px] text-[var(--admin-text-muted)]">
                {new Date(e.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
