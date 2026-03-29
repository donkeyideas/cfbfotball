'use client';

interface ModerationBadgeProps {
  status: string;
}

export function ModerationBadge({ status }: ModerationBadgeProps) {
  const config: Record<string, { label: string; color: string; border: string }> = {
    FLAGGED: {
      label: 'FLAGGED',
      color: 'var(--penalty-yellow, #d4a017)',
      border: 'var(--penalty-yellow, #d4a017)',
    },
    REMOVED: {
      label: 'REMOVED',
      color: 'var(--crimson)',
      border: 'var(--crimson)',
    },
    PUBLISHED: {
      label: 'CLEARED',
      color: 'var(--success, #2d6a4f)',
      border: 'var(--success, #2d6a4f)',
    },
  };

  const c = config[status] ?? config.FLAGGED!;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 2,
        fontSize: '0.6rem',
        fontWeight: 700,
        fontFamily: 'var(--sans)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: c.color,
        border: `1.5px solid ${c.border}`,
      }}
    >
      {c.label}
    </span>
  );
}
