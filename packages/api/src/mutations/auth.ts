// ============================================================
// Auth Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

interface SignUpMetadata {
  username: string;
  display_name?: string;
  avatar_url?: string;
}

/**
 * Sign up with email and password.
 * Profile is auto-created by the database trigger on auth.users insert.
 */
export async function signUp(
  client: SupabaseClient,
  email: string,
  password: string,
  metadata: SignUpMetadata
) {
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(
  client: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with an OAuth provider (Google, Apple, etc.)
 */
export async function signInWithOAuth(
  client: SupabaseClient,
  provider: 'google' | 'apple' | 'twitter'
) {
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut(client: SupabaseClient) {
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/**
 * Send a password reset email
 */
export async function resetPassword(client: SupabaseClient, email: string) {
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
  });

  if (error) throw error;
}
