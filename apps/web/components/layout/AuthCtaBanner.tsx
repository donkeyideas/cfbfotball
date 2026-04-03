'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export function AuthCtaBanner() {
  const { isLoggedIn } = useAuth();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('cfb-cta-dismissed')) return;
    setDismissed(false);
  }, []);

  if (isLoggedIn !== false || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem('cfb-cta-dismissed', '1');
  }

  return (
    <div className="auth-cta-banner">
      <div className="auth-cta-inner">
        <div className="auth-cta-text">
          <span className="auth-cta-headline">Join CFB Social</span>
          <span className="auth-cta-sub">
            Stake claims. Call shots. Build your dynasty.
          </span>
        </div>
        <div className="auth-cta-actions">
          <Link href="/register" className="auth-cta-btn-primary">
            Sign Up
          </Link>
          <Link href="/login" className="auth-cta-btn-secondary">
            Log In
          </Link>
        </div>
        <button
          onClick={dismiss}
          className="auth-cta-close"
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
    </div>
  );
}
