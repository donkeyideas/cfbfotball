import type { SupabaseClient } from '@supabase/supabase-js';

/** Apply a referral code after signup (if user forgot during registration) */
export async function applyReferralCode(client: SupabaseClient, code: string) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check user doesn't already have a referrer
  const { data: profile } = await client
    .from('profiles')
    .select('referred_by')
    .eq('id', user.id)
    .single();

  if (profile?.referred_by) {
    throw new Error('You have already been referred by another user.');
  }

  // Find referrer by code (prevent self-referral)
  const { data: referrer } = await client
    .from('profiles')
    .select('id')
    .eq('referral_code', code.toUpperCase())
    .neq('id', user.id)
    .maybeSingle();

  if (!referrer) throw new Error('Invalid referral code.');

  // Set referred_by
  await client
    .from('profiles')
    .update({ referred_by: referrer.id })
    .eq('id', user.id);

  // Create referral record
  await client
    .from('referrals')
    .insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      referral_code: code.toUpperCase(),
      status: 'PENDING',
    });

  return { referrerId: referrer.id };
}
