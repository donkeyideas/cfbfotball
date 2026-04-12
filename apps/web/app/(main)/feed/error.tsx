'use client';

export default function FeedError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="content-card" style={{ textAlign: 'center', padding: 32 }}>
      <p style={{ color: 'var(--faded-ink)', marginBottom: 16 }}>
        Unable to load posts right now. Please try again later.
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.85rem',
          color: 'var(--crimson)',
          background: 'none',
          border: '1px solid var(--crimson)',
          padding: '6px 16px',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}
