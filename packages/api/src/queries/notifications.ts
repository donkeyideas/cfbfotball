import type { SupabaseClient } from '@supabase/supabase-js';

// Get notifications for a user, ordered by created_at desc, limit 50
export async function getNotifications(client: SupabaseClient, userId: string, options?: { limit?: number; unreadOnly?: boolean }) {
  let query = client
    .from('notifications')
    .select(`
      *,
      actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(options?.limit ?? 50);

  if (options?.unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// Get unread count
export async function getUnreadNotificationCount(client: SupabaseClient, userId: string) {
  const { count, error } = await client
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count ?? 0;
}

// Get notification preferences
export async function getNotificationPreferences(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}
