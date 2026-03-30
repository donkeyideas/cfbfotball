import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Notifications',
};

export default function NotificationsPage() {
  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Notifications</h1>
      </div>
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsList />
      </Suspense>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="content-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: 200, height: 14, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: 80, height: 10 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function NotificationsList() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 32 }}>
        <p
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.1rem',
            color: 'var(--ink)',
          }}
        >
          Sign in to view notifications
        </p>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
            color: 'var(--faded-ink)',
            marginTop: 8,
          }}
        >
          You need to be logged in to see your notifications.
        </p>
      </div>
    );
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(
      '*, actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)'
    )
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ color: 'var(--faded-ink)', fontFamily: 'var(--sans)' }}>
          Unable to load notifications right now. Please try again later.
        </p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 32 }}>
        <p
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.1rem',
            color: 'var(--ink)',
          }}
        >
          No notifications yet
        </p>
        <p
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
            color: 'var(--faded-ink)',
            marginTop: 8,
          }}
        >
          When someone interacts with your posts or profile, you&apos;ll see it here.
        </p>
      </div>
    );
  }

  const { default: NotificationsClient } = await import('./NotificationsClient');

  return <NotificationsClient notifications={notifications} userId={user.id} />;
}
