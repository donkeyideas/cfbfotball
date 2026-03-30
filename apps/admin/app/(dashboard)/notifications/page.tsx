import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { NotificationsClient } from '@/components/notifications/notifications-client';

export const metadata = { title: 'Notifications' };

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Notifications</h1>
      <Suspense fallback={<LoadingSkeleton rows={10} />}>
        <NotificationsData />
      </Suspense>
    </div>
  );
}

async function NotificationsData() {
  const { getAdminActivityFeed } = await import('@/lib/actions/admin-notifications');
  const feed = await getAdminActivityFeed({ limit: 50 });
  return <NotificationsClient feed={feed} />;
}
