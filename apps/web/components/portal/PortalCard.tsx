'use client';

import Link from 'next/link';

interface School {
  id: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  logo_url: string | null;
}

interface PortalPlayerData {
  id: string;
  name: string;
  position: string;
  class_year: string | null;
  star_rating: number | null;
  height: string | null;
  weight: string | null;
  status: string | null;
  total_claims: number | null;
  entered_portal_at: string | null;
  previous_school_name: string | null;
  previous_school?: School | null;
  committed_school?: School | null;
}

export function PortalCard({ player }: { player: PortalPlayerData }) {
  const stars = player.star_rating ?? 0;
  const statusColor =
    player.status === 'COMMITTED'
      ? 'var(--success, #2d6a4f)'
      : player.status === 'WITHDRAWN'
        ? 'var(--text-muted)'
        : 'var(--gold)';

  const enteredDate = player.entered_portal_at
    ? new Date(player.entered_portal_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/portal/${player.id}`}
      className="dispatch"
      style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
    >
      {/* Left color bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: player.previous_school?.primary_color ?? 'var(--crimson)',
          borderRadius: '2px 0 0 2px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Player avatar placeholder */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: player.previous_school?.primary_color ?? 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--serif)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--cream)',
            flexShrink: 0,
          }}
        >
          {player.name[0]?.toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--ink)',
              }}
            >
              {player.name}
            </span>
            {stars > 0 && (
              <span className="dispatch-stars">
                {'\u2605'.repeat(stars)}
              </span>
            )}
          </div>

          {/* Position / School / Class */}
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--sans)',
              letterSpacing: '0.5px',
              marginTop: 2,
            }}
          >
            {player.position}
            {player.class_year && <> &middot; {player.class_year}</>}
            {player.previous_school
              ? <> &middot; {player.previous_school.abbreviation}</>
              : player.previous_school_name
                ? <> &middot; {player.previous_school_name}</>
                : null}
            {player.committed_school && (
              <span style={{ color: 'var(--success, #2d6a4f)' }}>
                {' '}&rarr; {player.committed_school.abbreviation}
              </span>
            )}
          </div>
        </div>

        {/* Right side: status + claims */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 2,
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: 'var(--sans)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: statusColor,
              border: `1px solid ${statusColor}`,
            }}
          >
            {player.status?.replace('_', ' ') ?? 'IN PORTAL'}
          </span>
          {(player.total_claims ?? 0) > 0 && (
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: 4,
                fontFamily: 'var(--sans)',
              }}
            >
              {player.total_claims} claim{player.total_claims !== 1 ? 's' : ''}
            </div>
          )}
          {enteredDate && (
            <div className="dispatch-time">{enteredDate}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
