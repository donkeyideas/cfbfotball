'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AppealFormProps {
  postId: string;
}

export function AppealForm({ postId }: AppealFormProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        style={{
          padding: '12px 16px',
          border: '1px dashed var(--border)',
          borderRadius: 2,
          fontFamily: 'var(--sans)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        Appeal submitted. You will be notified of the decision.
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="penalty-appeal"
      >
        Appeal to the Booth
      </button>
    );
  }

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('appeals')
        .insert({
          post_id: postId,
          user_id: user.id,
          reason: reason.trim(),
        });

      if (error) throw error;
      setSubmitted(true);
      router.refresh();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--penalty-yellow, #d4a017)',
        borderRadius: 2,
        background: 'var(--surface)',
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--penalty-yellow, #d4a017)',
          marginBottom: 8,
        }}
      >
        Appeal to the Booth
      </div>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain why this flag should be overturned..."
        maxLength={500}
        style={{
          width: '100%',
          padding: '8px 10px',
          fontFamily: 'var(--sans)',
          fontSize: '0.85rem',
          background: 'var(--warm-white, #faf8f0)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          minHeight: 60,
          resize: 'vertical',
          color: 'var(--ink)',
        }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={!reason.trim() || submitting}
          style={{
            flex: 1,
            padding: '6px 12px',
            background: reason.trim() ? 'var(--ink)' : 'var(--text-muted)',
            color: 'var(--cream)',
            border: 'none',
            borderRadius: 2,
            fontFamily: 'var(--sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: reason.trim() ? 'pointer' : 'not-allowed',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Appeal'}
        </button>
        <button
          onClick={() => setExpanded(false)}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            fontFamily: 'var(--sans)',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
