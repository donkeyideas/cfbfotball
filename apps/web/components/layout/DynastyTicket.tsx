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
    HEISMAN: 'Heisman',
    DYNASTY: 'Dynasty',
  };

  const tierLevel: Record<string, number> = {
    WALK_ON: 1,
    STARTER: 2,
    ALL_CONFERENCE: 3,
    ALL_AMERICAN: 4,
    HEISMAN: 5,
    DYNASTY: 6,
  };

  const dynastyTier = profile.dynasty_tier || 'WALK_ON';
  const level = tierLevel[dynastyTier] || 1;
  const xpForNext = level * 500;
  const xpPct = Math.min((profile.xp / xpForNext) * 100, 100);

  return (
    <div className="ticket-stub">
      <div className="ticket-title">Dynasty Stats</div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Level</span>
        <span className="ticket-stat-value">{level}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Total XP</span>
        <span className="ticket-stat-value">{profile.xp.toLocaleString()}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Rank</span>
        <span className="ticket-stat-value">
          {tierLabels[dynastyTier] || 'Walk-On'}
        </span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Takes Filed</span>
        <span className="ticket-stat-value">{profile.post_count}</span>
      </div>
      <div className="ticket-stat">
        <span className="ticket-stat-label">Win Rate</span>
        <span className="ticket-stat-value">
          {profile.post_count > 0 ? '68%' : '0%'}
        </span>
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
