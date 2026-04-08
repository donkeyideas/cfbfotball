import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.appOwnership === 'expo';

/**
 * Register for push notifications using native FCM/APNs tokens.
 * Loads expo-notifications lazily to avoid TurboModule crashes
 * during app launch.
 * Returns the token string or null if registration failed.
 */
export async function registerForPushNotifications(
  apiBaseUrl: string,
  getAccessToken: () => Promise<string | null>
): Promise<string | null> {
  try {
    if (isExpoGo || !Device.isDevice) return null;

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

    // Request permissions
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const result = await Notifications.requestPermissionsAsync();
      status = result.status;
    }
    if (status !== 'granted') return null;

    // Get native token (FCM on Android, APNs on iOS)
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const pushToken = tokenData.data as string;

    // Register with backend
    const accessToken = await getAccessToken();
    if (accessToken) {
      await fetch(`${apiBaseUrl}/api/fcm/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          token: pushToken,
          platform: Platform.OS,
        }),
      });
    }

    // Android: create notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      }).catch(() => {});
    }

    return pushToken;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log('Push registration failed:', err?.message || error);
    return null;
  }
}

/**
 * Unregister a push token (call on logout)
 */
export async function unregisterPushToken(
  apiBaseUrl: string,
  token: string,
  getAccessToken: () => Promise<string | null>
): Promise<void> {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await fetch(`${apiBaseUrl}/api/fcm/unregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token }),
      });
    }
  } catch {
    // Ignore errors on unregister
  }
}
