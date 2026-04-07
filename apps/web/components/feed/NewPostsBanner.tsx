'use client';

import { useRouter } from 'next/navigation';
import { useRealtimeFeed } from '@cfb-social/api';

interface NewPostsBannerProps {
  schoolId?: string;
}

export function NewPostsBanner({ schoolId }: NewPostsBannerProps) {
  const router = useRouter();
  const { newPosts, clearNewPosts } = useRealtimeFeed(schoolId);

  function handleClick() {
    clearNewPosts();
    router.refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (newPosts.length === 0) return <div style={{ minHeight: 0 }} />;

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '10px 16px',
        marginBottom: 12,
        background: 'var(--crimson)',
        color: 'var(--cream)',
        border: 'none',
        borderRadius: 2,
        fontFamily: 'var(--sans)',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      {newPosts.length} new {newPosts.length === 1 ? 'post' : 'posts'} &mdash; Click to refresh
    </button>
  );
}
