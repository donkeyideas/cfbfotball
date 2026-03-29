'use client';

import { useState, useEffect } from 'react';

interface XPToastProps {
  amount: number;
  label?: string;
  onDone?: () => void;
}

export function XPToast({ amount, label, onDone }: XPToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 2000,
        padding: '10px 20px',
        background: 'var(--dark-brown)',
        color: 'var(--gold)',
        borderRadius: 2,
        border: '1px solid var(--gold)',
        fontFamily: 'var(--sans)',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '1px',
        animation: 'xp-toast-in 0.3s ease-out',
        pointerEvents: 'none',
      }}
    >
      +{amount} XP{label ? ` — ${label}` : ''}
    </div>
  );
}
