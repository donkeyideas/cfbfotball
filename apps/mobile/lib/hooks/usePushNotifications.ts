import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';

// Push notifications require a development build (not Expo Go).
// expo-notifications was removed from Expo Go in SDK 53.
//
// The server-side infrastructure is ready:
//   - profiles.push_token column stores the device token
//   - on_notification_created trigger sends pushes via Expo push API
//
// To enable client-side push registration in a dev build:
//   1. Run: npx eas build --profile development --platform android
//   2. Uncomment the expo-notifications code in this file
//   3. The hook will register the device and save the token to Supabase

export function usePushNotifications() {
  const { userId } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  // Save push token to Supabase when user is logged in
  useEffect(() => {
    if (!userId || !expoPushToken) return;

    supabase
      .from('profiles')
      .update({ push_token: expoPushToken })
      .eq('id', userId)
      .then(() => {
        // Token saved
      });
  }, [userId, expoPushToken]);

  return { expoPushToken };
}
