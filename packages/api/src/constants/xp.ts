// ============================================================
// XP Values for each action type
// ============================================================

export const XP_VALUES = {
  POST_CREATED: 10,
  TOUCHDOWN_RECEIVED: 5,
  CHALLENGE_WON: 100,
  PREDICTION_CORRECT: 50,
  PORTAL_CLAIM_CORRECT: 75,
  RIVALRY_PARTICIPATION: 15,
  FACT_CHECK: 20,
  ACHIEVEMENT_UNLOCKED: 0, // varies per achievement
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10,
  RECEIPT_VERIFIED: 30,
  AGING_TAKE_CORRECT: 25,
  REFERRAL_ACTIVATED: 25,
} as const;

export type XPAction = keyof typeof XP_VALUES;
