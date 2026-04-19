'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { PostComposer } from './PostComposer';

export function FloatingComposer() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) return null;

  return (
    <>
      <button
        className="fab-compose"
        onClick={() => setOpen(true)}
        aria-label="New post"
        title="New post"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {open && (
        <div className="fab-modal-overlay" onClick={() => setOpen(false)}>
          <div className="fab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fab-modal-header">
              <span className="fab-modal-title">File a Report</span>
              <button
                className="fab-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <PostComposer />
          </div>
        </div>
      )}
    </>
  );
}
