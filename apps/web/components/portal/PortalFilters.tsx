'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'];
const statuses = ['IN_PORTAL', 'COMMITTED', 'WITHDRAWN'];

export function PortalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get('status') ?? '';
  const activePosition = searchParams.get('position') ?? '';
  const activeStars = searchParams.get('stars') ?? '';

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset cursor when filters change
    params.delete('cursor');
    const qs = params.toString();
    router.push(qs ? `/portal?${qs}` : '/portal');
  }

  const selectStyle: React.CSSProperties = {
    padding: '6px 10px',
    fontFamily: 'var(--sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    background: 'var(--surface)',
    color: 'var(--ink)',
    border: '1px solid var(--border)',
    borderRadius: 2,
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <select
        value={activeStatus}
        onChange={(e) => updateFilter('status', e.target.value)}
        style={selectStyle}
      >
        <option value="">All Status</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select
        value={activePosition}
        onChange={(e) => updateFilter('position', e.target.value)}
        style={selectStyle}
      >
        <option value="">All Positions</option>
        {positions.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={activeStars}
        onChange={(e) => updateFilter('stars', e.target.value)}
        style={selectStyle}
      >
        <option value="">Any Stars</option>
        <option value="5">5 Star</option>
        <option value="4">4+ Star</option>
        <option value="3">3+ Star</option>
      </select>
    </div>
  );
}
