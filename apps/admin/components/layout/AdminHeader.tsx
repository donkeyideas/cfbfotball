'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function AdminHeader() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAdminEmail(user.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-6">
      <div />

      <div className="flex items-center gap-4">
        {adminEmail && (
          <span className="text-sm text-[var(--admin-text-muted)]">{adminEmail}</span>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--admin-surface-raised)] hover:text-[var(--admin-text)]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
