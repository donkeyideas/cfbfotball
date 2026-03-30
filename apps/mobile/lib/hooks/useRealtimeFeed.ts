import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { subscribeFeed } from '@cfb-social/api';

export function useRealtimeFeed(schoolId?: string) {
  const [newPostCount, setNewPostCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof subscribeFeed> | null>(null);

  useEffect(() => {
    channelRef.current = subscribeFeed(supabase, schoolId, () => {
      setNewPostCount((prev) => prev + 1);
    });

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [schoolId]);

  function resetCount() {
    setNewPostCount(0);
  }

  return { newPostCount, resetCount };
}
