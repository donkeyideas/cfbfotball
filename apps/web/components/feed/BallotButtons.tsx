'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface BallotButtonsProps {
  postId: string;
  authorId?: string;
  touchdownCount: number;
  fumbleCount: number;
}

export function BallotButtons({ postId, authorId, touchdownCount, fumbleCount }: BallotButtonsProps) {
  const router = useRouter();
  const { isLoggedIn, userId } = useAuth();
  const [tdCount, setTdCount] = useState(touchdownCount);
  const [fmCount, setFmCount] = useState(fumbleCount);
  const [voted, setVoted] = useState<'TOUCHDOWN' | 'FUMBLE' | null>(null);

  // Load current user's existing reaction on mount
  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    supabase
      .from('reactions')
      .select('reaction_type')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setVoted(data.reaction_type as 'TOUCHDOWN' | 'FUMBLE');
        }
      });
  }, [postId, userId]);

  async function handleVote(type: 'TOUCHDOWN' | 'FUMBLE') {
    if (isLoggedIn === false) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (!userId) return;

    const supabase = createClient();

    if (voted === type) {
      // Un-vote: remove reaction
      if (type === 'TOUCHDOWN') setTdCount((c) => c - 1);
      else setFmCount((c) => c - 1);
      setVoted(null);

      await supabase
        .from('reactions')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);
      return;
    }

    // Optimistic update
    if (voted) {
      // Switching vote
      if (voted === 'TOUCHDOWN') setTdCount((c) => c - 1);
      else setFmCount((c) => c - 1);
    }
    if (type === 'TOUCHDOWN') setTdCount((c) => c + 1);
    else setFmCount((c) => c + 1);
    setVoted(type);

    // Delete existing then insert new (handles switching)
    await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    await supabase.from('reactions').insert({
      post_id: postId,
      user_id: userId,
      reaction_type: type,
    });

    // Create notification for post author
    if (authorId && authorId !== userId) {
      await supabase.from('notifications').insert({
        recipient_id: authorId,
        actor_id: userId,
        type: type === 'TOUCHDOWN' ? 'TOUCHDOWN' : 'FUMBLE',
        post_id: postId,
      });
    }
  }

  return (
    <div className="post-reactions">
      <button
        className="ballot-btn"
        onClick={() => handleVote('TOUCHDOWN')}
        style={voted === 'TOUCHDOWN' ? { background: 'var(--dark-brown)', color: 'var(--cream)' } : undefined}
      >
        <span className="vote-symbol">&#x2713;</span>
        <span className="vote-label">Touchdown</span>
        <span className="vote-count">{tdCount}</span>
      </button>
      <button
        className="ballot-btn"
        onClick={() => handleVote('FUMBLE')}
        style={voted === 'FUMBLE' ? { background: 'var(--dark-brown)', color: 'var(--cream)' } : undefined}
      >
        <span className="vote-symbol">&#x2717;</span>
        <span className="vote-label">Fumble</span>
        <span className="vote-count">{fmCount}</span>
      </button>
    </div>
  );
}
