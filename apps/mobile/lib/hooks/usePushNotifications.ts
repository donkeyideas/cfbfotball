import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from '@/lib/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

const isExpoGo = Constants.appOwnership === 'expo';

let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications!.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    /* expo-notifications not available */
  }
}

/**
 * Registers the device for push notifications when the user is signed in.
 * Uses native FCM/APNs tokens (not Expo Push tokens) and stores them
 * directly in the device_tokens table via Supabase.
 */
export function usePushNotifications() {
  const { userId } = useAuth();

  // Register push token
  useEffect(() => {
    if (!userId || !Notifications) return;

    async function registerPush() {
      try {
        // Request permission
        const { status: existingStatus } = await Notifications!.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications!.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;

        // Get native FCM/APNs token (NOT Expo Push token — that hangs on Android)
        const tokenData = await Notifications!.getDevicePushTokenAsync();
        const pushToken = tokenData.data as string;
        const platform = Platform.OS === 'ios' ? 'ios' : 'android';

        // Store directly via Supabase (avoids API URL redirect issues)
        const { error } = await supabase
          .from('device_tokens')
          .upsert(
            {
              user_id: userId,
              token: pushToken,
              platform,
              is_active: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'token' }
          );

        if (error) {
          console.log('Push token save failed:', error.message);
        }
      } catch (err) {
        console.log('Push registration error:', err);
      }
    }

    registerPush();
  }, [userId]);

  // Set up Android notification channel
  useEffect(() => {
    if (!Notifications || Platform.OS !== 'android') return;
    Notifications.setNotificationChannelAsync('default', {
      name: 'CFB Social',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8b1a1a',
      sound: 'default',
    });
  }, []);
}
