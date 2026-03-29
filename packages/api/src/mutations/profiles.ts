// ============================================================
// Profile Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileRow } from '@cfb-social/types';

interface ProfileUpdates {
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

/**
 * Update the current user's profile
 */
export async function updateProfile(
  client: SupabaseClient,
  updates: ProfileUpdates
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.username !== undefined) updatePayload.username = updates.username;
  if (updates.displayName !== undefined) updatePayload.display_name = updates.displayName;
  if (updates.bio !== undefined) updatePayload.bio = updates.bio;
  if (updates.avatarUrl !== undefined) updatePayload.avatar_url = updates.avatarUrl;

  const { data, error } = await client
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

/**
 * Select (or change) the user's school affiliation
 */
export async function selectSchool(client: SupabaseClient, schoolId: string) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('profiles')
    .update({
      school_id: schoolId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

/**
 * Upload an avatar image to Supabase Storage and update the profile
 */
export async function uploadAvatar(client: SupabaseClient, file: File) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  // Upload to the avatars bucket
  const { error: uploadError } = await client.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  // Get the public URL
  const { data: urlData } = client.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update the profile with the new avatar URL
  const { data, error } = await client
    .from('profiles')
    .update({
      avatar_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}
