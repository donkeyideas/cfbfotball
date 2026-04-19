import type { SupabaseClient } from '@supabase/supabase-js';

/** Get a user's referral stats (code, count, char_limit) */
export async function getReferralStats(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('profiles')
    .select('referral_code, referral_count, char_limit')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as { referral_code: string | null; referral_count: number; char_limit: number };
}

/** Get a user's referral history (who they referred) */
export async function getReferralHistory(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('referrals')
    .select('id, referred_id, referral_code, status, activated_at, created_at')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Validate a referral code exists and return the referrer info */
export async function validateReferralCode(client: SupabaseClient, code: string) {
  const { data, error } = await client
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('referral_code', code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data;
}
