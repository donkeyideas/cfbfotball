'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { SchoolRow } from '@cfb-social/types';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';

export function SettingsClient() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }

      const [profileResult, schoolsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).single(),
        supabase.from('schools').select('*').eq('is_active', true).order('name'),
      ]);

      if (profileResult.data) {
        setDisplayName(profileResult.data.display_name ?? '');
        setBio(profileResult.data.bio ?? '');
        setSchoolId(profileResult.data.school_id ?? '');
      }

      if (schoolsResult.data) {
        setSchools(schoolsResult.data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        bio: bio || null,
        school_id: schoolId || null,
      })
      .eq('id', authUser.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
      router.refresh();
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold">Settings</h1>
        <div className="gridiron-card p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Settings</h1>

      <div className="gridiron-card p-6">
        {message && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              message.type === 'success'
                ? 'bg-[var(--success)]/10 text-[var(--success)]'
                : 'bg-[var(--error)]/10 text-[var(--error)]'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="gridiron-input w-full"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={3}
              className="gridiron-input w-full resize-none"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{bio.length}/280</p>
          </div>

          <div>
            <label htmlFor="school" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
              School
            </label>
            <select
              id="school"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="gridiron-input w-full"
            >
              <option value="">No school selected</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <hr className="gridiron-divider" />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-crimson px-6 py-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/settings/profile"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-ink"
            >
              Full Profile Editor
            </Link>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="gridiron-card p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold">Appearance</h2>
        <div>
          <label htmlFor="fontPref" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Font Style
          </label>
          <select
            id="fontPref"
            defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('cfb-font-pref') ?? 'classic') : 'classic'}
            onChange={(e) => {
              const val = e.target.value;
              localStorage.setItem('cfb-font-pref', val);
              if (val === 'modern') {
                document.documentElement.setAttribute('data-font', 'modern');
              } else {
                document.documentElement.removeAttribute('data-font');
              }
            }}
            className="gridiron-input w-full"
          >
            <option value="classic">Classic (Serif)</option>
            <option value="modern">Modern (Sans-Serif)</option>
          </select>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Changes how headlines and body text appear across the site.
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="gridiron-card p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold">Notification Preferences</h2>
        <NotificationPreferences />
      </div>

      {/* Legal */}
      <div className="gridiron-card p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold">Legal</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="text-sm font-medium text-[var(--text-secondary)] hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm font-medium text-[var(--text-secondary)] hover:text-ink">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm font-medium text-[var(--text-secondary)] hover:text-ink">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Account */}
      <div className="gridiron-card p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold">Account</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
              router.refresh();
            }}
            className="rounded-md border border-[var(--error)] px-4 py-2 text-sm font-semibold text-[var(--error)] transition-colors hover:bg-[var(--error)]/10"
          >
            Sign Out
          </button>
          <Link
            href="/delete-account"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--error)]"
          >
            Delete Account
          </Link>
        </div>
      </div>
    </div>
  );
}
