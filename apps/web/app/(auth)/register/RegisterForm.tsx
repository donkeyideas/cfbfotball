'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { SchoolRow } from '@cfb-social/types';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchools() {
      const supabase = createClient();
      const { data } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (data) setSchools(data);
    }
    fetchSchools();
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          school_id: schoolId,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      router.push('/feed');
      router.refresh();
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-ink">
        Join CFB Social
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
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
            placeholder="your_handle"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Letters, numbers, and underscores only
          </p>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="gridiron-input w-full"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="gridiron-input w-full"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Minimum 8 characters
          </p>
        </div>

        <div>
          <label htmlFor="school" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Your School
          </label>
          <select
            id="school"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
            className="gridiron-input w-full"
          >
            <option value="">Select your school...</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-crimson w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-crimson hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
