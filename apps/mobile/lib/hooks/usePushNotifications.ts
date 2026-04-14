import { useEffect, useRef } from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { WEB_API_URL } from '@/lib/constants';

// Push notifications are not supported in Expo Go (SDK 53+)
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Only configure notification handler in dev builds / standalone
if (!isExpoGo) {
  const Notifications = require('expo-notifications') as typeof import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Registers for push notifications on mount (when user is authenticated),
 * and sets up listeners for notification taps.
 * Skips entirely in Expo Go where push is unsupported.
 */
export function usePushNotifications() {
  const { session } = useAuth();
  const responseListener = useRef<any>(null);
  const coldStartHandled = useRef(false);

  useEffect(() => {
    if (isExpoGo || !session?.access_token) return;

    const Notifications = require('expo-notifications') as typeof import('expo-notifications');
    const { registerForPushNotifications } = require('@/lib/notifications/pushRegistration');

    // Register for push notifications
    registerForPushNotifications(
      WEB_API_URL,
      async () => session.access_token
    ).catch((err: any) => console.error('[Push] Registration failed:', err));

    // Handle cold-start: check if the app was opened from a notification tap
    if (!coldStartHandled.current) {
      coldStartHandled.current = true;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) {
          // Small delay to let the router initialize
          setTimeout(() => {
            router.push('/notifications');
          }, 500);
        }
      });
    }

    // Listen for notification taps while app is running (foreground/background)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      () => {
        router.push('/notifications');
      }
    );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [session?.access_token]);
}
