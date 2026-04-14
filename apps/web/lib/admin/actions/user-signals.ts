import { createAdminClient } from '@/lib/admin/supabase/admin';

export async function getSignalsSummary() {
  const supabase = createAdminClient();
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [totalEvents, eventsToday, events24h, events7d, uniqueSessions] = await Promise.all([
    supabase.from('user_events').select('*', { count: 'exact', head: true }),
    supabase.from('user_events').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('user_events').select('*', { count: 'exact', head: true }).gte('created_at', last24h),
    supabase.from('user_events').select('*', { count: 'exact', head: true }).gte('created_at', last7d),
    supabase.from('user_events').select('session_id').gte('created_at', last24h),
  ]);

  const uniqueSessionCount = new Set(
    (uniqueSessions.data ?? []).map((e: { session_id: string }) => e.session_id),
  ).size;

  return {
    totalEvents: totalEvents.count ?? 0,
    eventsToday: eventsToday.count ?? 0,
    events24h: events24h.count ?? 0,
    events7d: events7d.count ?? 0,
    uniqueSessions24h: uniqueSessionCount,
  };
}

export async function getEventTypeBreakdown(hours: number = 24) {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('user_events')
    .select('event_type')
    .gte('created_at', since);

  const counts: Record<string, number> = {};
  for (const e of events ?? []) {
    counts[e.event_type] = (counts[e.event_type] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([event_type, count]) => ({ event_type, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getTopContent(hours: number = 24) {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('user_events')
    .select('event_target, target_id, duration_ms')
    .gte('created_at', since)
    .not('target_id', 'is', null);

  // Aggregate by target
  const targets: Record<string, { target: string; target_id: string; views: number; total_dwell_ms: number }> = {};
  for (const e of events ?? []) {
    const key = `${e.event_target}:${e.target_id}`;
    if (!targets[key]) {
      targets[key] = { target: e.event_target, target_id: e.target_id, views: 0, total_dwell_ms: 0 };
    }
    targets[key].views++;
    targets[key].total_dwell_ms += e.duration_ms ?? 0;
  }

  return Object.values(targets)
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);
}

export async function getHourlyActivity(hours: number = 24) {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('user_events')
    .select('created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  // Group by hour
  const hourly: Record<string, number> = {};
  for (let i = 0; i < hours; i++) {
    const h = new Date(Date.now() - (hours - 1 - i) * 60 * 60 * 1000);
    const key = h.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    hourly[key] = 0;
  }

  for (const e of events ?? []) {
    const key = new Date(e.created_at).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    if (hourly[key] !== undefined) hourly[key]++;
  }

  return Object.entries(hourly).map(([hour, count]) => ({ hour, count }));
}

export async function getRecentEvents(limit: number = 50) {
  const supabase = createAdminClient();

  const { data: events } = await supabase
    .from('user_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return events ?? [];
}

export async function getDwellTimeStats() {
  const supabase = createAdminClient();
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('user_events')
    .select('event_type, duration_ms')
    .gte('created_at', last24h)
    .not('duration_ms', 'is', null)
    .gt('duration_ms', 0);

  if (!events || events.length === 0) {
    return { avgDwellMs: 0, medianDwellMs: 0, totalEvents: 0 };
  }

  const durations = events.map((e: { duration_ms: number }) => e.duration_ms).sort((a: number, b: number) => a - b);
  const total = durations.reduce((s: number, d: number) => s + d, 0);

  return {
    avgDwellMs: Math.round(total / durations.length),
    medianDwellMs: durations[Math.floor(durations.length / 2)],
    totalEvents: durations.length,
  };
}
