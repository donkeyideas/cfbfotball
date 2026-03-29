'use client';

interface VoteBarProps {
  votesA: number;
  votesB: number;
  labelA: string;
  labelB: string;
  colorA?: string;
  colorB?: string;
}

export function VoteBar({ votesA, votesB, labelA, labelB, colorA = 'var(--crimson)', colorB = 'var(--dark-brown)' }: VoteBarProps) {
  const total = votesA + votesB;
  const pctA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const pctB = total > 0 ? 100 - pctA : 50;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 600, color: colorA }}>
          {labelA} ({votesA})
        </span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 600, color: colorB }}>
          {labelB} ({votesB})
        </span>
      </div>
      <div style={{
        display: 'flex',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        background: 'var(--tan)',
      }}>
        <div style={{
          width: `${pctA}%`,
          background: colorA,
          transition: 'width 0.5s ease',
        }} />
        <div style={{
          width: `${pctB}%`,
          background: colorB,
          transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--faded-ink)' }}>
          {pctA}%
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--faded-ink)' }}>
          {total} total votes
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--faded-ink)' }}>
          {pctB}%
        </span>
      </div>
    </div>
  );
}
