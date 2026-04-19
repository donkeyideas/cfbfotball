import { Suspense } from 'react';
import { ReferralsClient } from './ReferralsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Referral System — Admin' };

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <h1 className="admin-section-title">Referral System</h1>
      <Suspense fallback={<div className="admin-card p-6">Loading referral data...</div>}>
        <ReferralsClient />
      </Suspense>
    </div>
  );
}
