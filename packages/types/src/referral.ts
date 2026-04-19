// ============================================================
// Referral System Types & Constants
// ============================================================

export interface ReferralTier {
  name: string;
  minReferrals: number;
  charLimit: number;
}

export interface ReferralRow {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'PENDING' | 'ACTIVATED';
  activated_at: string | null;
  created_at: string;
}

/** Default tier configuration (can be overridden via admin_settings) */
export const REFERRAL_CHAR_TIERS: ReferralTier[] = [
  { name: 'Walk-On', minReferrals: 0, charLimit: 500 },
  { name: 'Recruited', minReferrals: 5, charLimit: 750 },
  { name: 'Scholarship', minReferrals: 15, charLimit: 1000 },
  { name: 'Captain', minReferrals: 30, charLimit: 1500 },
  { name: 'Coach', minReferrals: 50, charLimit: 2000 },
  { name: 'Commissioner', minReferrals: 100, charLimit: 3000 },
];

/** Get the character limit for a given referral count */
export function getCharLimitForReferrals(
  referralCount: number,
  tiers: ReferralTier[] = REFERRAL_CHAR_TIERS,
): number {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (referralCount >= tiers[i]!.minReferrals) {
      return tiers[i]!.charLimit;
    }
  }
  return tiers[0]?.charLimit ?? 500;
}

/** Get the current tier info for a given referral count */
export function getReferralTier(
  referralCount: number,
  tiers: ReferralTier[] = REFERRAL_CHAR_TIERS,
): ReferralTier {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (referralCount >= tiers[i]!.minReferrals) {
      return tiers[i]!;
    }
  }
  return tiers[0]!;
}

/** Get the next tier (or null if at max) */
export function getNextReferralTier(
  referralCount: number,
  tiers: ReferralTier[] = REFERRAL_CHAR_TIERS,
): ReferralTier | null {
  for (const tier of tiers) {
    if (referralCount < tier.minReferrals) return tier;
  }
  return null;
}
