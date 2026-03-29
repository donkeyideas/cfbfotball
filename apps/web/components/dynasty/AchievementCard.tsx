'use client';

interface AchievementCardProps {
  name: string;
  description: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  earnedAt?: string | null;
}

const categoryIcons: Record<string, string> = {
  SOCIAL: 'S',
  PREDICTION: 'P',
  RIVALRY: 'R',
  RECRUITING: 'RC',
  ENGAGEMENT: 'E',
  MILESTONE: 'M',
};

export function AchievementCard({ name, description, category, xpReward, unlocked, earnedAt }: AchievementCardProps) {
  return (
    <div
      style={{
        padding: '12px 16px',
        border: `1px solid ${unlocked ? 'var(--gold)' : 'var(--border)'}`,
        borderRadius: 2,
        background: unlocked ? 'var(--surface)' : 'transparent',
        opacity: unlocked ? 1 : 0.6,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: unlocked ? 'var(--gold)' : 'var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--serif)',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: unlocked ? 'var(--ink)' : 'var(--text-muted)',
          flexShrink: 0,
        }}
      >
        {categoryIcons[category] ?? '?'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
          {name}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          {description}
        </div>
        {earnedAt && (
          <div style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Earned {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* XP reward */}
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: unlocked ? 'var(--gold)' : 'var(--text-muted)',
          letterSpacing: '0.5px',
          flexShrink: 0,
        }}
      >
        +{xpReward} XP
      </div>
    </div>
  );
}
