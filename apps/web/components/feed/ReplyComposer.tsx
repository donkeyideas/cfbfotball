'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface ReplyComposerProps {
  parentId: string;
  parentAuthorId?: string;
}

export function ReplyComposer({ parentId, parentAuthorId }: ReplyComposerProps) {
  const router = useRouter();
  const { userId, profile } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting || !userId) return;

    setSubmitting(true);

    const supabase = createClient();

    const { error } = await supabase.from('posts').insert({
      content: content.trim(),
      post_type: 'STANDARD',
      author_id: userId,
      school_id: profile?.school_id ?? null,
      parent_id: parentId,
      root_id: parentId,
      status: 'PUBLISHED',
    });

    if (!error) {
      setContent('');
      // Notify the parent post author
      if (parentAuthorId && parentAuthorId !== userId) {
        await supabase.from('notifications').insert({
          recipient_id: parentAuthorId,
          actor_id: userId,
          type: 'REPLY',
          post_id: parentId,
        });
      }
      router.refresh();
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="composer" style={{ marginTop: 8 }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        maxLength={500}
        className="composer-input"
        rows={2}
      />
      <div className="composer-footer">
        <div />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="composer-submit"
          style={{ opacity: !content.trim() || submitting ? 0.5 : 1 }}
        >
          {submitting ? 'Replying...' : 'Reply'}
        </button>
      </div>
    </form>
  );
}
