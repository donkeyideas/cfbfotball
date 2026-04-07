'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface ProfileEditModalProps {
  userId: string;
  onClose: () => void;
  onSaved: (newUsername: string) => void;
}

interface School {
  id: string;
  name: string;
}

async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  userId: string,
  file: File,
  name: string,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop() ?? 'jpg';
  const filePath = `${userId}/${name}.${fileExt}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (error) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  // Cache-bust so the browser shows the new image immediately
  return `${data.publicUrl}?t=${Date.now()}`;
}

export function ProfileEditModal({ userId, onClose, onSaved }: ProfileEditModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const [profileResult, schoolsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('schools').select('id, name').eq('is_active', true).order('name'),
    ]);

    if (profileResult.data) {
      setDisplayName(profileResult.data.display_name ?? '');
      setUsername((profileResult.data.username ?? '').replace(/[^a-zA-Z0-9_]/g, '_'));
      setBio(profileResult.data.bio ?? '');
      setSchoolId(profileResult.data.school_id ?? '');
      setCurrentAvatar(profileResult.data.avatar_url ?? null);
      setCurrentBanner((profileResult.data as Record<string, unknown>).banner_url as string | null);
    }

    if (schoolsResult.data) {
      setSchools(schoolsResult.data);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // File previews
  useEffect(() => {
    if (!avatarFile) { setAvatarPreview(null); return; }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (!bannerFile) { setBannerPreview(null); return; }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  // Escape + body scroll lock
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Upload images in parallel
    const [avatarUrl, bannerUrl] = await Promise.all([
      avatarFile ? uploadImage(supabase, 'avatars', userId, avatarFile, 'avatar') : Promise.resolve(undefined),
      bannerFile ? uploadImage(supabase, 'avatars', userId, bannerFile, 'banner') : Promise.resolve(undefined),
    ]);

    if (avatarFile && !avatarUrl) {
      setError('Failed to upload profile photo.');
      setSaving(false);
      return;
    }
    if (bannerFile && !bannerUrl) {
      setError('Failed to upload banner image.');
      setSaving(false);
      return;
    }

    const updatePayload: Record<string, unknown> = {
      display_name: displayName || null,
      bio: bio || null,
      school_id: schoolId || null,
      username,
      updated_at: new Date().toISOString(),
    };

    if (avatarUrl) updatePayload.avatar_url = avatarUrl;
    if (bannerUrl) updatePayload.banner_url = bannerUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved(username);
  }

  const avatarSrc = avatarPreview ?? currentAvatar;
  const bannerSrc = bannerPreview ?? currentBanner;
  const initial = (displayName || username || '?')[0]?.toUpperCase();

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--warm-white, #f9f6ee)', border: '2px solid rgba(59,47,30,0.25)', borderRadius: 6, maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner area */}
        <div
          style={{
            height: 120,
            background: bannerSrc ? `url(${bannerSrc}) center/cover no-repeat` : 'linear-gradient(135deg, var(--crimson, #8b1a1a), #c0392b)',
            borderRadius: '4px 4px 0 0',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('bannerUpload')?.click()}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '4px 4px 0 0', opacity: 0.7, transition: 'opacity 0.15s' }}>
            <span style={{ color: '#fff', fontSize: '0.82rem', fontFamily: 'var(--sans)', fontWeight: 600, letterSpacing: 0.5 }}>Change Banner</span>
          </div>
          <input
            id="bannerUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
            style={{ display: 'none' }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 8, right: 12, background: 'rgba(0,0,0,0.4)', border: 'none', fontSize: '1.1rem', color: '#fff', cursor: 'pointer', lineHeight: 1, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          x
        </button>

        {/* Content below banner */}
        <div style={{ padding: '0 28px 28px' }}>
          {/* Avatar overlapping banner */}
          <div style={{ marginTop: -40, marginBottom: 16, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div
              style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--warm-white, #f9f6ee)', background: 'var(--crimson, #8b1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', position: 'relative' }}
              onClick={() => document.getElementById('avatarUpload')?.click()}
            >
              {avatarSrc ? (
                <Image src={avatarSrc} alt="Avatar" width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{initial}</span>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', opacity: 0.6 }}>
                <span style={{ color: '#fff', fontSize: '0.6rem', fontFamily: 'var(--sans)', fontWeight: 600 }}>Edit</span>
              </div>
            </div>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              style={{ display: 'none' }}
            />
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-brown, #3b2f1e)', letterSpacing: 1, textTransform: 'uppercase' as const }}>
              Edit Profile
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: 40, width: '100%' }} />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && (
                <div style={{ background: 'rgba(200,40,40,0.1)', color: 'var(--error, #c82828)', padding: '10px 12px', borderRadius: 3, fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <Field label="Username">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '_'))}
                  required
                  minLength={3}
                  maxLength={24}
                  pattern="^[a-zA-Z0-9_]+$"
                  className="gridiron-input"
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--faded-ink)' }}>Letters, numbers, and underscores only.</span>
              </Field>

              <Field label="Display Name">
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} className="gridiron-input" style={{ width: '100%' }} placeholder="Your display name" />
              </Field>

              <Field label="Bio">
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={3} className="gridiron-input" style={{ width: '100%', resize: 'none' }} placeholder="Tell the conference about yourself..." />
                <span style={{ fontSize: '0.72rem', color: 'var(--faded-ink)', textAlign: 'right', fontFamily: 'var(--mono)' }}>{bio.length}/280</span>
              </Field>

              <Field label="School Affiliation">
                <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="gridiron-input" style={{ width: '100%' }}>
                  <option value="">No school selected</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Font Style">
                <select
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
                  className="gridiron-input"
                  style={{ width: '100%' }}
                >
                  <option value="classic">Classic (Serif)</option>
                  <option value="modern">Modern (Sans-Serif)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: 'var(--faded-ink)' }}>Changes headlines and body text across the site.</span>
              </Field>

              <button type="submit" disabled={saving} className="btn-crimson" style={{ width: '100%', padding: '10px', marginTop: 4, opacity: saving ? 0.5 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--faded-ink, #888)' }}>{label}</label>
      {children}
    </div>
  );
}
