'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Activity, Users, MessageSquare, AlertTriangle } from 'lucide-react';

interface RealtimeMetrics {
  activeUsers: number;
  postsLastHour: number;
  reactionsLastHour: number;
  flagsLastHour: number;
}

export default function RealtimePage() {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    activeUsers: 0,
    postsLastHour: 0,
    reactionsLastHour: 0,
    flagsLastHour: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Array<{ id: string; type: string; text: string; time: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchMetrics() {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const [postsResult, flagsResult] = await Promise.all([
        supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneHourAgo),
        supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'FLAGGED')
          .gte('updated_at', oneHourAgo),
      ]);

      setMetrics({
        activeUsers: 0,
        postsLastHour: postsResult.count ?? 0,
        reactionsLastHour: 0,
        flagsLastHour: flagsResult.count ?? 0,
      });
      setLoading(false);
    }

    fetchMetrics();

    // Subscribe to realtime changes on posts table
    const channel = supabase
      .channel('admin-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setRecentEvents((prev) => [
            {
              id: payload.new.id,
              type: 'post',
              text: `New post created (${payload.new.post_type})`,
              time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 49),
          ]);
          setMetrics((prev) => ({ ...prev, postsLastHour: prev.postsLastHour + 1 }));
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts', filter: 'status=eq.FLAGGED' },
        (payload) => {
          setRecentEvents((prev) => [
            {
              id: payload.new.id,
              type: 'flag',
              text: `Post flagged for moderation`,
              time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 49),
          ]);
          setMetrics((prev) => ({ ...prev, flagsLastHour: prev.flagsLastHour + 1 }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statCards = [
    { label: 'Active Users', value: metrics.activeUsers, icon: Users, color: 'var(--admin-success)' },
    { label: 'Posts (1h)', value: metrics.postsLastHour, icon: MessageSquare, color: 'var(--admin-info)' },
    { label: 'Reactions (1h)', value: metrics.reactionsLastHour, icon: Activity, color: 'var(--admin-accent)' },
    { label: 'Flags (1h)', value: metrics.flagsLastHour, icon: AlertTriangle, color: 'var(--admin-warning)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Real-time Monitor</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--admin-success)]/20 px-3 py-1 text-xs font-semibold text-[var(--admin-success)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--admin-success)]" />
          Live
        </span>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="admin-card p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--admin-text-muted)]">{card.label}</p>
                <Icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
              <p className="mt-2 text-3xl font-bold">
                {loading ? <span className="skeleton inline-block h-8 w-12" /> : card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live event stream */}
      <div className="admin-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Event Stream</h2>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-[var(--admin-text-muted)]">
            Waiting for events... Events will appear here in real-time.
          </p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {recentEvents.map((event) => (
              <div
                key={`${event.id}-${event.time}`}
                className="flex items-center gap-3 rounded-md bg-[var(--admin-surface-raised)] px-3 py-2 text-sm"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    event.type === 'flag' ? 'bg-[var(--admin-warning)]' : 'bg-[var(--admin-info)]'
                  }`}
                />
                <span className="flex-1 text-[var(--admin-text-secondary)]">{event.text}</span>
                <span className="shrink-0 text-xs text-[var(--admin-text-muted)]">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
