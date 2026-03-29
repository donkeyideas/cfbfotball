'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface School {
  id: string;
  name: string;
  mascot: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const supabase = createClient();

  const loadProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const [profileResult, schoolsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('schools').select('id, name, mascot').eq('is_active', true).order('name'),
    ]);

    if (profileResult.data) {
      setDisplayName(profileResult.data.display_name ?? '');
      setBio(profileResult.data.bio ?? '');
      setUsername(profileResult.data.username ?? '');
      setSchoolId(profileResult.data.school_id ?? '');
    }

    if (schoolsResult.data) {
      setSchools(schoolsResult.data);
    }

    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upload avatar if selected
    let avatarUrl: string | undefined;
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true, contentType: avatarFile.type });

      if (uploadError) {
        setError('Failed to upload avatar: ' + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatarUrl = urlData.publicUrl;
    }

    const updatePayload: Record<string, unknown> = {
      display_name: displayName || null,
      bio: bio || null,
      school_id: schoolId || null,
      username,
      updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
      updatePayload.avatar_url = avatarUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <div className="skeleton h-8 w-48" />
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
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-serif text-2xl font-bold">Edit Profile</h1>

      {error && (
        <div className="mb-4 rounded-md bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="gridiron-card space-y-5 p-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={24}
            pattern="^[a-zA-Z0-9_]+$"
            className="gridiron-input w-full"
          />
        </div>

        {/* Display Name */}
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
            placeholder="Your display name"
          />
        </div>

        {/* Bio */}
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
            placeholder="Tell the conference about yourself..."
          />
          <p className="mt-1 text-right text-xs text-[var(--text-muted)]">
            {bio.length}/280
          </p>
        </div>

        {/* School */}
        <div>
          <label htmlFor="school" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            School Affiliation
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

        {/* Avatar */}
        <div>
          <label htmlFor="avatar" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Avatar
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="gridiron-input w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-3 file:py-1 file:text-sm file:font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-crimson w-full py-3 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
