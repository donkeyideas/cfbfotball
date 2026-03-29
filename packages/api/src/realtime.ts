// ============================================================
// Realtime Subscriptions - Non-React (for Edge Functions, Workers, etc.)
// ============================================================

import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type { PostRow, NotificationRow } from '@cfb-social/types';

/**
 * Subscribe to real-time feed changes for a specific user's school feed.
 * Returns the channel for manual cleanup.
 */
export function subscribeFeed(
  client: SupabaseClient,
  schoolId: string | undefined,
  callback: (post: PostRow) => void
): RealtimeChannel {
  const filter = schoolId
    ? `status=eq.PUBLISHED,school_id=eq.${schoolId}`
    : `status=eq.PUBLISHED`;

  const channel = client
    .channel(`feed:${schoolId ?? 'global'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter,
      },
      (payload) => {
        callback(payload.new as PostRow);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to real-time notifications for a specific user.
 * Returns the channel for manual cleanup.
 */
export function subscribeNotifications(
  client: SupabaseClient,
  userId: string,
  callback: (notification: NotificationRow) => void
): RealtimeChannel {
  const channel = client
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as NotificationRow);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to a presence channel (e.g., who is online in a rivalry thread).
 * Returns the channel for manual cleanup.
 */
export function subscribePresence(
  client: SupabaseClient,
  channelId: string,
  callbacks?: {
    onSync?: () => void;
    onJoin?: (key: string, newPresence: unknown) => void;
    onLeave?: (key: string, leftPresence: unknown) => void;
  }
): RealtimeChannel {
  const channel = client.channel(`presence:${channelId}`, {
    config: {
      presence: {
        key: channelId,
      },
    },
  });

  if (callbacks?.onSync) {
    channel.on('presence', { event: 'sync' }, callbacks.onSync);
  }

  if (callbacks?.onJoin) {
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      callbacks.onJoin!(key, newPresences);
    });
  }

  if (callbacks?.onLeave) {
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      callbacks.onLeave!(key, leftPresences);
    });
  }

  channel.subscribe();
  return channel;
}
