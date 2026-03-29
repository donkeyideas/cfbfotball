import { XP_THRESHOLDS, getTierForLevel, getXPToNextLevel, getLevelProgress } from '@cfb-social/types';

const tierColors: Record<string, string> = {
  WALK_ON: 'var(--text-muted)',
  STARTER: 'var(--info)',
  ALL_CONFERENCE: 'var(--success)',
  ALL_AMERICAN: 'var(--warning)',
  HEISMAN: 'var(--crimson)',
  HALL_OF_FAME: 'var(--secondary)',
};

const tierLabels: Record<string, string> = {
  WALK_ON: 'Walk-On',
  STARTER: 'Starter',
  ALL_CONFERENCE: 'All-Conference',
  ALL_AMERICAN: 'All-American',
  HEISMAN: 'Heisman',
  HALL_OF_FAME: 'Hall of Fame',
};

interface DynastyProgressProps {
  xp: number;
  level: number;
  dynastyTier: string;
}

export function DynastyProgress({ xp, level, dynastyTier }: DynastyProgressProps) {
  const progress = getLevelProgress(xp, level);
  const xpNeeded = getXPToNextLevel(xp, level);
  const color = tierColors[dynastyTier] ?? 'var(--text-muted)';
  const label = tierLabels[dynastyTier] ?? dynastyTier.replace(/_/g, ' ');

  return (
    <div className="gridiron-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
          >
            {label}
          </span>
          <span className="text-sm text-[var(--text-muted)]">Level {level}</span>
        </div>
        <span className="font-mono text-sm font-semibold">{xp.toLocaleString()} XP</span>
      </div>

      {/* XP progress bar */}
      <div className="mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-[var(--text-muted)]">
          {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP to next level` : 'Max level reached'}
        </p>
      </div>
    </div>
  );
}
