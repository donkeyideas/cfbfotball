import { Suspense } from 'react';
import Link from 'next/link';
import { UserActions } from '@/components/users/UserActions';

export const metadata = {
  title: 'Users',
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Search form */}
      <div className="admin-card p-4">
        <form method="GET" action="/users" className="flex items-center gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by username..."
            className="admin-input flex-1"
          />
          <button type="submit" className="btn-admin">
            Search
          </button>
          {q && (
            <Link
              href="/users"
              className="text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      <Suspense
        fallback={
          <div className="admin-card overflow-hidden">
            <div className="skeleton h-96 w-full" />
          </div>
        }
      >
        <UsersTable q={q} />
      </Suspense>
    </div>
  );
}

async function UsersTable({ q }: { q?: string }) {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select(
      `
      id,
      username,
      display_name,
      email,
      role,
      status,
      dynasty_tier,
      xp,
      level,
      post_count,
      created_at,
      school:schools!profiles_school_id_fkey(id, name, abbreviation)
    `,
    )
    .order('created_at', { ascending: false })
    .limit(100);

  if (q) {
    query = query.ilike('username', `%${q}%`);
  }

  const { data: users, error } = await query;

  if (error || !users || users.length === 0) {
    return (
      <div className="admin-card p-8 text-center text-[var(--admin-text-muted)]">
        {q ? `No users found matching "${q}".` : 'No users found.'}
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-[var(--admin-text-muted)]">
        Showing {users.length} user{users.length !== 1 ? 's' : ''}
        {q ? ` matching "${q}"` : ''}
      </div>

      <div className="admin-card overflow-hidden overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>School</th>
              <th>Role</th>
              <th>Status</th>
              <th>Tier</th>
              <th>XP</th>
              <th>Level</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link href={`/users/${user.id}`} className="block">
                    <p className="font-medium hover:text-[var(--admin-accent)]">
                      {user.display_name ?? user.username}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      @{user.username}
                    </p>
                  </Link>
                </td>
                <td className="text-sm text-[var(--admin-text-secondary)]">
                  {(user.school as { abbreviation?: string } | null)
                    ?.abbreviation ?? '-'}
                </td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-[var(--admin-accent)]/20 text-[var(--admin-accent-light)]'
                        : user.role === 'MODERATOR'
                          ? 'bg-[var(--admin-warning)]/20 text-[var(--admin-warning)]'
                          : 'bg-[var(--admin-surface-raised)] text-[var(--admin-text-secondary)]'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.status === 'ACTIVE'
                        ? 'bg-[var(--admin-success)]/20 text-[var(--admin-success)]'
                        : user.status === 'SUSPENDED'
                          ? 'bg-[var(--admin-warning)]/20 text-[var(--admin-warning)]'
                          : 'bg-[var(--admin-error)]/20 text-[var(--admin-error)]'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="text-xs uppercase text-[var(--admin-text-muted)]">
                  {user.dynasty_tier?.replace('_', ' ') ?? '-'}
                </td>
                <td className="text-sm">{user.xp ?? 0}</td>
                <td className="text-sm">{user.level ?? 0}</td>
                <td className="text-xs text-[var(--admin-text-muted)]">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td>
                  <UserActions
                    userId={user.id}
                    currentRole={user.role}
                    currentStatus={user.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
