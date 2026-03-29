'use client';

interface PredictionBadgeProps {
  result: string;
}

export function PredictionBadge({ result }: PredictionBadgeProps) {
  const config: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING: {
      label: 'PENDING',
      color: 'var(--gold)',
      bg: 'transparent',
      border: 'var(--gold)',
    },
    CORRECT: {
      label: 'RECEIPT',
      color: 'var(--success, #2d6a4f)',
      bg: 'transparent',
      border: 'var(--success, #2d6a4f)',
    },
    INCORRECT: {
      label: 'BUST',
      color: 'var(--crimson)',
      bg: 'transparent',
      border: 'var(--crimson)',
    },
    PUSH: {
      label: 'PUSH',
      color: 'var(--text-muted)',
      bg: 'transparent',
      border: 'var(--text-muted)',
    },
    EXPIRED: {
      label: 'EXPIRED',
      color: 'var(--text-muted)',
      bg: 'transparent',
      border: 'var(--text-muted)',
    },
  };

  const c = config[result] ?? config.PENDING!;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 2,
        fontSize: '0.65rem',
        fontWeight: 700,
        fontFamily: 'var(--sans)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: c.color,
        background: c.bg,
        border: `1.5px solid ${c.border}`,
      }}
    >
      {c.label}
    </span>
  );
}
