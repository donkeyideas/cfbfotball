'use client';

interface DynastyTierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig: Record<string, { label: string; color: string; bg: string }> = {
  WALK_ON: { label: 'Walk-On', color: 'var(--text-muted)', bg: 'var(--surface)' },
  STARTER: { label: 'Starter', color: '#2d6a4f', bg: '#d8f3dc' },
  ALL_CONFERENCE: { label: 'All-Conf', color: '#0077b6', bg: '#caf0f8' },
  ALL_AMERICAN: { label: 'All-American', color: '#7b2cbf', bg: '#e0aaff' },
  HEISMAN: { label: 'Heisman', color: '#b8860b', bg: '#ffd700' },
  HALL_OF_FAME: { label: 'Hall of Fame', color: '#8b0000', bg: '#ffd700' },
};

const sizes = {
  sm: { padding: '1px 6px', fontSize: '0.6rem' },
  md: { padding: '2px 10px', fontSize: '0.7rem' },
  lg: { padding: '4px 14px', fontSize: '0.8rem' },
};

export function DynastyTierBadge({ tier, size = 'md' }: DynastyTierBadgeProps) {
  const config = tierConfig[tier] ?? tierConfig.WALK_ON!;
  const sizeStyle = sizes[size];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: sizeStyle.padding,
        borderRadius: 2,
        fontSize: sizeStyle.fontSize,
        fontWeight: 700,
        fontFamily: 'var(--sans)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}`,
      }}
    >
      {config.label}
    </span>
  );
}
