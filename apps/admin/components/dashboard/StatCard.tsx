import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardData {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

export function StatCard({ stat }: { stat: StatCardData }) {
  const TrendIcon =
    stat.trend === 'up'
      ? TrendingUp
      : stat.trend === 'down'
        ? TrendingDown
        : Minus;

  const trendColor =
    stat.trend === 'up'
      ? 'text-[var(--admin-success)]'
      : stat.trend === 'down'
        ? 'text-[var(--admin-error)]'
        : 'text-[var(--admin-text-muted)]';

  return (
    <div className="admin-card p-6">
      <p className="text-sm text-[var(--admin-text-muted)]">{stat.label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-bold text-[var(--admin-text)]">
          {stat.value.toLocaleString()}
        </p>
        {stat.change !== 0 && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {stat.change > 0 ? '+' : ''}
              {stat.change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
