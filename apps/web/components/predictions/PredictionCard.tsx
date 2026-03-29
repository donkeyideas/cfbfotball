'use client';

import Link from 'next/link';
import { PredictionBadge } from './PredictionBadge';

interface PredictionUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  dynasty_tier: string | null;
}

interface PredictionData {
  id: string;
  prediction_text: string;
  category: string | null;
  target_date: string | null;
  result: string | null;
  created_at: string | null;
  post_id: string | null;
  user?: PredictionUser | null;
}

export function PredictionCard({ prediction }: { prediction: PredictionData }) {
  const result = prediction.result ?? 'PENDING';
  const userName = prediction.user?.display_name ?? prediction.user?.username ?? 'Unknown';
  const username = prediction.user?.username ?? 'unknown';

  const categoryLabels: Record<string, string> = {
    GAME_OUTCOME: 'Game Outcome',
    SEASON_RECORD: 'Season Record',
    PLAYER_PERFORMANCE: 'Player Performance',
    RECRUITING: 'Recruiting',
    AWARD: 'Award',
    CUSTOM: 'Custom',
  };

  const createdDate = prediction.created_at
    ? new Date(prediction.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  const targetDate = prediction.target_date
    ? new Date(prediction.target_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Visual treatment based on result
  const borderColor =
    result === 'CORRECT'
      ? 'var(--success, #2d6a4f)'
      : result === 'INCORRECT'
        ? 'var(--crimson)'
        : 'var(--gold)';

  return (
    <div
      className="gridiron-card"
      style={{
        padding: 16,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {/* Top row: user + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            href={`/profile/${username}`}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--ink)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {userName[0]?.toUpperCase()}
          </Link>
          <div>
            <Link
              href={`/profile/${username}`}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              @{username}
            </Link>
            {createdDate && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 8 }}>
                {createdDate}
              </span>
            )}
          </div>
        </div>

        <PredictionBadge result={result} />
      </div>

      {/* Prediction text */}
      <div
        style={{
          fontFamily: 'var(--serif)',
          fontSize: '1rem',
          lineHeight: 1.5,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        {prediction.prediction_text}
      </div>

      {/* Category + target date */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          fontFamily: 'var(--sans)',
          fontSize: '0.7rem',
          letterSpacing: '0.5px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {prediction.category && (
          <span>{categoryLabels[prediction.category] ?? prediction.category}</span>
        )}
        {targetDate && <span>Target: {targetDate}</span>}
        {prediction.post_id && (
          <Link
            href={`/post/${prediction.post_id}`}
            style={{ color: 'var(--crimson)', textDecoration: 'none' }}
          >
            View Post
          </Link>
        )}
      </div>
    </div>
  );
}
