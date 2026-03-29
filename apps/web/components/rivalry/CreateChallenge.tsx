'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function CreateChallenge() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !topic.trim() || submitting) return;

    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      setSubmitting(false);
      return;
    }

    // Find the challenged user
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim().replace('@', ''))
      .single();

    if (!profile) {
      setError('User not found');
      setSubmitting(false);
      return;
    }

    if (profile.id === user.id) {
      setError('You cannot challenge yourself');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('challenges').insert({
      challenger_id: user.id,
      challenged_id: profile.id,
      topic: topic.trim(),
      status: 'PENDING',
    });

    if (insertError) {
      setError('Failed to create challenge');
      setSubmitting(false);
      return;
    }

    setOpen(false);
    setUsername('');
    setTopic('');
    setSubmitting(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="composer-submit"
        style={{ marginBottom: 16 }}
      >
        Issue Challenge
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="composer" style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.65rem',
        letterSpacing: 2,
        color: 'var(--faded-ink)',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Issue a Challenge
      </div>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Opponent username (e.g. BuckeyeNation)"
        className="composer-input"
        style={{
          fontFamily: 'var(--sans)',
          marginBottom: 8,
          padding: '6px 0',
          minHeight: 'auto',
          backgroundImage: 'none',
        }}
      />

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What's the debate? (e.g. 'Alabama has a better QB room than Georgia')"
        className="composer-input"
        rows={2}
        maxLength={200}
      />

      {error && (
        <p style={{ color: 'var(--crimson)', fontSize: '0.75rem', marginTop: 4 }}>{error}</p>
      )}

      <div className="composer-footer">
        <button type="button" onClick={() => setOpen(false)} className="composer-tool">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!username.trim() || !topic.trim() || submitting}
          className="composer-submit"
          style={{ opacity: !username.trim() || !topic.trim() || submitting ? 0.5 : 1 }}
        >
          {submitting ? 'Sending...' : 'Send Challenge'}
        </button>
      </div>
    </form>
  );
}
