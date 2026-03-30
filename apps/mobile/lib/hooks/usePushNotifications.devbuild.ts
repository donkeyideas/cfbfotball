/**
 * Push notification hook for DEVELOPMENT BUILDS ONLY.
 *
 * To use this:
 * 1. Rename this file to usePushNotifications.ts (replacing the stub)
 * 2. Build with: npx eas build --profile development --platform android
 * 3. Install the dev build APK on your device
 *
 * DO NOT import this file while running in Expo Go — it will crash.
 */
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8b1a1a',
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId
      ?? Constants.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId ?? undefined,
    });
    return tokenData.data;
  } catch {
    return null;
  }
}

type EventSubscription = { remove: () => void };

export function usePushNotifications() {
  const { userId } = useAuth();
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // Notification received in foreground
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.postId) {
        router.push(`/post/${data.postId}` as never);
      } else if (data?.screen === 'notifications') {
        router.push('/notifications' as never);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!userId || !expoPushToken) return;

    (async () => {
      try {
        await supabase
          .from('device_tokens')
          .upsert(
            {
              user_id: userId,
              token: expoPushToken,
              platform: Platform.OS,
              is_active: true,
            },
            { onConflict: 'user_id,token' }
          );
      } catch (err) {
        console.warn('Failed to save push token:', err);
      }
    })();
  }, [userId, expoPushToken]);

  return { expoPushToken };
}
