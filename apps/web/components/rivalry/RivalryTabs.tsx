'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const tabs = [
  { value: 'rivalries', label: 'Rivalries' },
  { value: 'challenges', label: 'Challenges' },
] as const;

export function RivalryTabs() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'challenges' ? 'challenges' : 'rivalries';

  return (
    <div className="feed-tabs">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value === 'rivalries' ? '/rivalry' : `/rivalry?tab=${tab.value}`}
          className={`feed-tab ${activeTab === tab.value ? 'active' : ''}`}
          prefetch={false}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
