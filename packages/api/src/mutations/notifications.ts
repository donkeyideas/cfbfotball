import type { SupabaseClient } from '@supabase/supabase-js';

// Mark a single notification as read
export async function markNotificationRead(client: SupabaseClient, notificationId: string) {
  const { error } = await client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

// Mark all notifications as read for a user
export async function markAllNotificationsRead(client: SupabaseClient, userId: string) {
  const { error } = await client
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

// Create a notification (used by server-side triggers)
export async function createNotification(
  client: SupabaseClient,
  notification: {
    recipient_id: string;
    actor_id?: string | null;
    type: string;
    post_id?: string | null;
    challenge_id?: string | null;
    data?: Record<string, unknown> | null;
  }
) {
  const { data, error } = await client
    .from('notifications')
    .insert({
      recipient_id: notification.recipient_id,
      actor_id: notification.actor_id ?? null,
      type: notification.type,
      post_id: notification.post_id ?? null,
      challenge_id: notification.challenge_id ?? null,
      data: notification.data ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update notification preferences
export async function updateNotificationPreferences(
  client: SupabaseClient,
  userId: string,
  prefs: Partial<{
    push_enabled: boolean;
    email_enabled: boolean;
    follow_notifications: boolean;
    reaction_notifications: boolean;
    reply_notifications: boolean;
    challenge_notifications: boolean;
    rivalry_notifications: boolean;
    moderation_notifications: boolean;
    marketing_notifications: boolean;
  }>
) {
  const { data, error } = await client
    .from('notification_preferences')
    .upsert({
      user_id: userId,
      ...prefs,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
