import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { subscribeNotifications } from '@cfb-social/api';

export function useRealtimeNotifications(userId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof subscribeNotifications> | null>(null);

  useEffect(() => {
    if (!userId) return;

    channelRef.current = subscribeNotifications(supabase, userId, () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [userId]);

  function resetCount() {
    setUnreadCount(0);
  }

  return { unreadCount, resetCount };
}
