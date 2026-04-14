import { permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.cfbsocial.com/feed',
  },
};

export default function RootPage() {
  permanentRedirect('/feed');
}
