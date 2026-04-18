'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ accentColor }: { accentColor?: string }) {
  const router = useRouter();
  const color = accentColor || 'var(--crimson)';

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        padding: '6px 14px',
        fontFamily: 'var(--sans)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        color: color,
        background: 'transparent',
        border: `1px solid ${color}`,
        borderRadius: 2,
        cursor: 'pointer',
      }}
    >
      Sign Out
    </button>
  );
}
