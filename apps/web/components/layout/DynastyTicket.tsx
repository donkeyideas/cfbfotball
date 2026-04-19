'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export function DynastyTicket() {
  const { isLoggedIn, profile } = useAuth();

  if (isLoggedIn === false) {
    return (
      <div className="ticket-stub">
        <div className="ticket-title">Dynasty Mode</div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--faded-ink)', lineHeight: 1.5, marginBottom: 10, textAlign: 'center' }}>
          Build your dynasty. Earn XP. Climb the ranks.
        </p>
        <Link
          href="/register"
          style={{ display: 'block', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--crimson)', textDecoration: 'underline' }}
        >
          Sign up to start your dynasty
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const tierLabels: Record<string, string> = {
    WALK_ON: 'Walk-On',
    STARTER: 'Starter',
    ALL_CONFERENCE: 'All-Conference',
    ALL_AMERICAN: 'All-American',
    HALL_OF_FAME: 'Hall of Fame',
    HEISMAN: 'Heisman',
  };

  const dynastyTier = profile.dynasty_tier || 'WALK_ON';
  const XP_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200, 10000, 12500, 15500, 19000, 23000, 28000, 34000, 41000, 50000];
  const userLevel = profile.level ?? 1;
  const currentThreshold = XP_THRESHOLDS[userLevel - 1] ?? 0;
  const nextThreshold = XP_THRESHOLDS[userLevel] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1]!;
  const xpForNext = nextThreshold;
  const xpPct = nextThreshold > currentThreshold
    ? Math.min(100, ((profile.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100;

  // Compute real prediction accuracy
  const correct = profile.correct_predictions ?? 0;
  const total = profile.prediction_count ?? 0;
  const winRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="ticket-stub">
      <div className="ticket-title">Dynasty Stats</div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Level</span>
        <span className="ticket-stat-value">{userLevel}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Total XP</span>
        <span className="ticket-stat-value">{profile.xp.toLocaleString()}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Rank</span>
        <span className="ticket-stat-value">
          {tierLabels[dynastyTier] || dynastyTier}
        </span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Takes Filed</span>
        <span className="ticket-stat-value">{profile.post_count}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Predictions</span>
        <span className="ticket-stat-value">
          {total > 0 ? `${correct}/${total} (${winRate}%)` : '0'}
        </span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Recruits</span>
        <span className="ticket-stat-value">{profile?.referral_count ?? 0}</span>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
      </div>
      <div className="xp-text">
        {profile.xp} / {xpForNext} XP to next tier
      </div>
    </div>
  );
}
