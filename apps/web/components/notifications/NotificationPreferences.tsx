'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface PreferenceState {
  follow_notifications: boolean;
  reaction_notifications: boolean;
  reply_notifications: boolean;
  challenge_notifications: boolean;
  rivalry_notifications: boolean;
  moderation_notifications: boolean;
}

const defaultPrefs: PreferenceState = {
  follow_notifications: true,
  reaction_notifications: true,
  reply_notifications: true,
  challenge_notifications: true,
  rivalry_notifications: true,
  moderation_notifications: true,
};

const preferenceLabels: { key: keyof PreferenceState; label: string; description: string }[] = [
  { key: 'follow_notifications', label: 'Follow notifications', description: 'When someone starts following you' },
  { key: 'reaction_notifications', label: 'Reaction notifications', description: 'Touchdowns and Fumbles on your posts' },
  { key: 'reply_notifications', label: 'Reply notifications', description: 'Replies to your posts and takes' },
  { key: 'challenge_notifications', label: 'Challenge notifications', description: 'Challenge invites and results' },
  { key: 'rivalry_notifications', label: 'Rivalry notifications', description: 'Rivalry updates and outcomes' },
  { key: 'moderation_notifications', label: 'Moderation notifications', description: 'Flags, warnings, and appeal results' },
];

export function NotificationPreferences() {
  const { userId } = useAuth();
  const [prefs, setPrefs] = useState<PreferenceState>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Fetch current preferences
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function loadPrefs() {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (data) {
        setPrefs({
          follow_notifications: data.follow_notifications ?? true,
          reaction_notifications: data.reaction_notifications ?? true,
          reply_notifications: data.reply_notifications ?? true,
          challenge_notifications: data.challenge_notifications ?? true,
          rivalry_notifications: data.rivalry_notifications ?? true,
          moderation_notifications: data.moderation_notifications ?? true,
        });
      }

      setLoading(false);
    }

    loadPrefs();
  }, [userId]);

  function handleToggle(key: keyof PreferenceState) {
    setSaved(false);
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const supabase = createClient();

      const { error: upsertError } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: userId,
            ...prefs,
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;

      setSaved(true);
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="gridiron-card"
        style={{ padding: 24, textAlign: 'center' }}
      >
        <span
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          Loading preferences...
        </span>
      </div>
    );
  }

  return (
    <div className="gridiron-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--crimson)',
            marginBottom: 4,
          }}
        >
          Settings
        </div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          Notification Preferences
        </div>
      </div>

      {/* Toggle list */}
      <div style={{ padding: '8px 0' }}>
        {preferenceLabels.map(({ key, label, description }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: 2,
                }}
              >
                {description}
              </div>
            </div>

            {/* Toggle switch */}
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 40,
                height: 22,
                flexShrink: 0,
                marginLeft: 12,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => handleToggle(key)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  position: 'absolute',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: prefs[key] ? 'var(--crimson)' : 'var(--border)',
                  borderRadius: 11,
                  transition: 'background 0.2s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: prefs[key] ? 20 : 2,
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '8px 24px',
            background: 'var(--crimson)',
            color: '#fff',
            border: 'none',
            borderRadius: 2,
            fontFamily: 'var(--sans)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>

        {saved && (
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.75rem',
              color: 'var(--ink)',
              fontWeight: 600,
            }}
          >
            Saved
          </span>
        )}

        {error && (
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.75rem',
              color: 'var(--crimson)',
            }}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
