'use client';

import dynamic from 'next/dynamic';

const NewPostsBanner = dynamic(
  () => import('./NewPostsBanner').then((m) => m.NewPostsBanner),
  { ssr: false },
);

export function NewPostsBannerLazy() {
  return <NewPostsBanner />;
}
