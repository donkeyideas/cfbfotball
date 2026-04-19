'use client';

import { useState } from 'react';
import { getReferralTier, getNextReferralTier } from '@cfb-social/types';

interface RecruitingCardProps {
  referralCode: string;
  referralCount: number;
  charLimit: number;
}

export function RecruitingCard({ referralCode, referralCount, charLimit }: RecruitingCardProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const currentTier = getReferralTier(referralCount);
  const nextTier = getNextReferralTier(referralCount);

  const progressPct = nextTier
    ? Math.min(100, ((referralCount - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100)
    : 100;

  const inviteLink = `https://www.cfbsocial.com/join/${referralCode}`;

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join me on CFB Social',
      text: `Join the college football conversation on CFB Social. Use my referral code: ${referralCode}`,
      url: inviteLink,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    copyToClipboard(inviteLink, 'link');
  };

  return (
    <div className="content-card" style={{ padding: '16px 24px' }}>
      <h3 style={{
        fontFamily: 'var(--sans)',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        Recruiting Rank
      </h3>

      {/* Tier + progress text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700 }}>
          {currentTier.name}
        </span>
        {nextTier ? (
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {referralCount}/{nextTier.minReferrals} to {nextTier.name}
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--gold)' }}>
            MAX RANK
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          background: 'var(--crimson)',
          borderRadius: 4,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Referral code */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Your Code:
        </span>
        <code style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '1px',
          background: 'var(--surface)',
          padding: '2px 8px',
          borderRadius: 4,
          border: '1px solid var(--border)',
        }}>
          {referralCode}
        </code>
        <button
          onClick={() => copyToClipboard(referralCode, 'code')}
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            color: copied === 'code' ? 'var(--gold)' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}
        >
          {copied === 'code' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Character limit */}
      <div style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
        Character Limit: <strong style={{ color: 'var(--text-secondary)' }}>{charLimit.toLocaleString()}</strong>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        style={{
          width: '100%',
          fontFamily: 'var(--sans)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          background: 'var(--dark-brown)',
          color: 'var(--cream)',
          border: 'none',
          borderRadius: 6,
          padding: '10px 16px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {copied === 'link' ? 'Link Copied!' : 'Share Invite Link'}
      </button>
    </div>
  );
}
