/**
 * Push notification registration is disabled for initial store release.
 * Re-enable after approval by reinstalling expo-notifications and
 * restoring the plugin in app.json.
 */

export async function registerForPushNotifications(
  _apiBaseUrl: string,
  _getAccessToken: () => Promise<string | null>
): Promise<string | null> {
  return null;
}

export async function unregisterPushToken(
  _apiBaseUrl: string,
  _token: string,
  _getAccessToken: () => Promise<string | null>
): Promise<void> {
  // no-op
}
