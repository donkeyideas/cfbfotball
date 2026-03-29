'use client';

interface ClaimData {
  school: {
    id: string;
    name: string;
    abbreviation: string;
    primary_color: string;
  };
  count: number;
  avgConfidence: number;
}

interface SchoolInterestBarProps {
  claims: ClaimData[];
  totalClaims: number;
}

export function SchoolInterestBar({ claims, totalClaims }: SchoolInterestBarProps) {
  if (claims.length === 0) {
    return (
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '12px 0',
        }}
      >
        No claims filed yet. Be the first to make your call.
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: 10,
        }}
      >
        Community Claims ({totalClaims})
      </div>

      {/* Stacked bar */}
      <div
        style={{
          display: 'flex',
          height: 24,
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 10,
          border: '1px solid var(--border)',
        }}
      >
        {claims.map((c) => {
          const pct = totalClaims > 0 ? (c.count / totalClaims) * 100 : 0;
          return (
            <div
              key={c.school.id}
              style={{
                width: `${pct}%`,
                background: c.school.primary_color,
                minWidth: pct > 0 ? 20 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'var(--sans)',
              }}
              title={`${c.school.name}: ${c.count} claims (${Math.round(pct)}%)`}
            >
              {pct >= 15 ? c.school.abbreviation : ''}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
        {claims.map((c) => {
          const pct = totalClaims > 0 ? Math.round((c.count / totalClaims) * 100) : 0;
          return (
            <div
              key={c.school.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.75rem',
                fontFamily: 'var(--sans)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 1,
                  background: c.school.primary_color,
                }}
              />
              <span style={{ fontWeight: 600 }}>{c.school.abbreviation}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                {pct}% ({c.count})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
