'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

const CONFIRM_TEXT = 'DELETE';
const CONTACT_EMAIL = 'info@donkeyideas.com';

export function DeleteAccountForm() {
  const router = useRouter();
  const { isLoggedIn, userId, profile } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const canDelete = confirmation.trim().toUpperCase() === CONFIRM_TEXT;

  // Loading state
  if (isLoggedIn === null) {
    return (
      <div className="content-card" style={{ padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', color: 'var(--faded-ink)' }}>
          Loading...
        </p>
      </div>
    );
  }

  // Not logged in
  if (isLoggedIn === false) {
    return (
      <div className="content-card" style={{ padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
          Sign in required
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', color: 'var(--faded-ink)', marginBottom: 16 }}>
          You must be signed in to delete your account.
        </p>
        <Link
          href="/login?redirect=/delete-account"
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--crimson)',
            textDecoration: 'underline',
          }}
        >
          Sign in
        </Link>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <div className="content-card" style={{ padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
          Account Deleted
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', color: 'var(--faded-ink)', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 16px' }}>
          Your account has been permanently deleted and you have been signed out. If you have any questions, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--crimson)' }}>{CONTACT_EMAIL}</a>.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--crimson)',
            textDecoration: 'underline',
          }}
        >
          Return to home
        </Link>
      </div>
    );
  }

  async function handleDelete() {
    if (!canDelete || !userId) return;
    setDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/delete-account', { method: 'POST' });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to delete account');
      }

      // Sign out client-side after server deletes the auth user
      const supabase = createClient();
      await supabase.auth.signOut();

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account. Please try again or contact support.');
      setDeleting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Warning box */}
      <div
        className="content-card"
        style={{
          padding: '20px 24px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
        }}
      >
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#991b1b',
          marginBottom: 10,
        }}>
          WARNING: This action is permanent
        </p>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#7f1d1d',
          marginBottom: 6,
        }}>
          Deleting your account will:
        </p>
        <ul style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.85rem',
          lineHeight: 1.8,
          color: '#7f1d1d',
          paddingLeft: 20,
          marginBottom: 10,
        }}>
          <li>Permanently delete your account and all profile information</li>
          <li>Remove your login credentials — you will not be able to sign back in</li>
          <li>Your posts will remain but will no longer be associated with your profile</li>
        </ul>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#991b1b',
        }}>
          This cannot be undone.
        </p>
      </div>

      {/* Account info */}
      <div className="content-card" style={{ padding: '16px 24px' }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.65rem',
          color: 'var(--faded-ink)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Account
        </div>
        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--ink)',
        }}>
          {profile?.username ? `@${profile.username}` : 'Unknown'}
        </div>
      </div>

      {/* Confirmation */}
      <div className="content-card" style={{ padding: '20px 24px' }}>
        <label
          htmlFor="confirm-delete"
          style={{
            display: 'block',
            fontFamily: 'var(--sans)',
            fontSize: '0.88rem',
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          Type &quot;{CONFIRM_TEXT}&quot; to confirm account deletion:
        </label>
        <input
          id="confirm-delete"
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={CONFIRM_TEXT}
          autoComplete="off"
          style={{
            width: '100%',
            maxWidth: 280,
            padding: '10px 14px',
            fontFamily: 'var(--mono)',
            fontSize: '1.1rem',
            letterSpacing: '4px',
            textAlign: 'center',
            border: '2px solid #e5a1a1',
            borderRadius: 4,
            backgroundColor: 'var(--parchment)',
            color: 'var(--ink)',
            outline: 'none',
          }}
        />

        {error && (
          <div style={{
            marginTop: 12,
            fontFamily: 'var(--sans)',
            fontSize: '0.82rem',
            color: '#b91c1c',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 4,
            padding: '10px 14px',
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            style={{
              padding: '10px 24px',
              fontFamily: 'var(--sans)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fff',
              backgroundColor: canDelete ? '#991b1b' : 'var(--faded-ink)',
              border: 'none',
              borderRadius: 4,
              cursor: canDelete && !deleting ? 'pointer' : 'not-allowed',
              opacity: deleting ? 0.6 : 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {deleting ? 'Deleting...' : 'Delete My Account'}
          </button>
          <Link
            href="/settings"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              fontFamily: 'var(--sans)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--faded-ink)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Support */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.78rem',
          color: 'var(--faded-ink)',
          lineHeight: 1.5,
        }}>
          Need help? Contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--crimson)', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </div>
  );
}
