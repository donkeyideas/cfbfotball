'use client';

import { createClient } from '@/lib/supabase/client';

type EventType =
  | 'post_viewed'
  | 'post_expanded'
  | 'post_click'
  | 'feed_scroll'
  | 'page_view'
  | 'school_hub_visit'
  | 'war_room_join'
  | 'profile_visit'
  | 'search'
  | 'share'
  | 'reaction_click'
  | 'challenge_view'
  | 'portal_player_view'
  | 'prediction_view';

type EventTarget =
  | 'post'
  | 'school'
  | 'profile'
  | 'game_thread'
  | 'challenge'
  | 'portal_player'
  | 'prediction'
  | 'page'
  | 'feed';

interface TrackEventParams {
  event_type: EventType;
  event_target?: EventTarget;
  target_id?: string;
  metadata?: Record<string, unknown>;
  duration_ms?: number;
}

// Generate a session ID per browser tab
let sessionId: string | null = null;
function getSessionId(): string {
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return sessionId;
}

// Queue for batching events
let eventQueue: TrackEventParams[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 5000; // 5 seconds
const MAX_QUEUE_SIZE = 20;

async function flushEvents() {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const rows = batch.map((e) => ({
      user_id: user?.id ?? null,
      session_id: getSessionId(),
      event_type: e.event_type,
      event_target: e.event_target ?? null,
      target_id: e.target_id ?? null,
      metadata: e.metadata ?? {},
      duration_ms: e.duration_ms ?? null,
    }));

    await supabase.from('user_events').insert(rows);
  } catch {
    // Silent fail — analytics should never break the app
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushEvents();
  }, FLUSH_INTERVAL);
}

export function trackEvent(params: TrackEventParams) {
  eventQueue.push(params);
  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    flushEvents();
  } else {
    scheduleFlush();
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushEvents();
    }
  });
}

// Track post view with dwell time
export function trackPostView(postId: string) {
  const start = Date.now();
  trackEvent({ event_type: 'post_viewed', event_target: 'post', target_id: postId });

  return () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Only track if viewed > 1 second
      trackEvent({
        event_type: 'post_expanded',
        event_target: 'post',
        target_id: postId,
        duration_ms: duration,
      });
    }
  };
}

// Track page view
export function trackPageView(page: string) {
  trackEvent({ event_type: 'page_view', event_target: 'page', target_id: page });
}

// Track school hub visit
export function trackSchoolVisit(schoolId: string, slug: string) {
  trackEvent({
    event_type: 'school_hub_visit',
    event_target: 'school',
    target_id: schoolId,
    metadata: { slug },
  });
}
