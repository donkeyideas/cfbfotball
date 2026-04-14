'use client';

import { useEffect } from 'react';
import { trackPostView } from '@/lib/analytics/track';

export function PostDwellTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const endTracking = trackPostView(postId);
    return endTracking;
  }, [postId]);

  return null;
}
