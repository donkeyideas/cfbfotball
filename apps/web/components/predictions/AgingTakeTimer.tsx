'use client';

import { useState, useEffect } from 'react';

interface AgingTakeTimerProps {
  revisitDate: string;
  isSurfaced: boolean;
}

export function AgingTakeTimer({ revisitDate, isSurfaced }: AgingTakeTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function update() {
      const target = new Date(revisitDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Ready for review');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h remaining`);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      }
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [revisitDate]);

  if (isSurfaced) {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 2,
          fontSize: '0.65rem',
          fontWeight: 700,
          fontFamily: 'var(--sans)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          border: '1.5px solid var(--gold)',
        }}
      >
        Aged &mdash; Ready for review
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 2,
        fontSize: '0.65rem',
        fontWeight: 700,
        fontFamily: 'var(--sans)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        border: '1.5px solid var(--border)',
      }}
    >
      Aging &mdash; {timeLeft}
    </span>
  );
}
