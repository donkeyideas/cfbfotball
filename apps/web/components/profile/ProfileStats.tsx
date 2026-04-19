interface ProfileStatsProps {
  postCount: number;
  touchdownCount: number;
  fumbleCount: number;
  predictionCount: number;
  correctPredictions: number;
  challengeWins: number;
  challengeLosses: number;
  referralCount: number;
}

export function ProfileStats({
  postCount,
  touchdownCount,
  fumbleCount,
  predictionCount,
  correctPredictions,
  challengeWins,
  challengeLosses,
  referralCount,
}: ProfileStatsProps) {
  const tdFumRatio = fumbleCount > 0
    ? (touchdownCount / fumbleCount).toFixed(1)
    : touchdownCount > 0 ? 'Perfect' : '-';

  const predictionAccuracy = predictionCount > 0
    ? Math.round((correctPredictions / predictionCount) * 100)
    : 0;

  const challengeRecord = `${challengeWins}-${challengeLosses}`;

  return (
    <div className="gridiron-card p-4">
      <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Season Stats
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatItem label="Posts" value={postCount.toString()} />
        <StatItem label="TD/FUM Ratio" value={tdFumRatio.toString()} />
        <StatItem
          label="Prediction %"
          value={predictionCount > 0 ? `${predictionAccuracy}%` : '-'}
        />
        <StatItem label="Challenge Record" value={challengeRecord} />
        <StatItem label="Recruits" value={referralCount.toString()} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
