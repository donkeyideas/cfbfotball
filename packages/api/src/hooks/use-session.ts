// ============================================================
// useSession Hook - Client-side auth state management
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createBrowserClient } from '../client';
import type { ProfileRow } from '@cfb-social/types';

interface UseSessionReturn {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * React hook for managing the Supabase auth session on the client side.
 * Automatically listens for auth state changes and fetches the user's profile.
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as ProfileRow);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setLoading(false);
  }, [supabase]);

  return {
    user: session?.user ?? null,
    session,
    profile,
    loading,
    signOut: handleSignOut,
  };
}
