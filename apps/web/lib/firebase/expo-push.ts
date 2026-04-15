/**
 * Send push notifications via Expo's push service.
 * Handles both iOS (APNs) and Android (FCM) routing automatically.
 * Used for Expo push tokens (format: ExponentPushToken[...]).
 */

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error?: string };
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Send push notifications to one or more Expo push tokens.
 * Returns the count of successful and failed sends.
 */
export async function sendExpoPush(
  tokens: string[],
  payload: { title: string; body: string; data?: Record<string, string> }
): Promise<{ sent: number; failed: number; invalidTokens: string[] }> {
  if (tokens.length === 0) return { sent: 0, failed: 0, invalidTokens: [] };

  const messages: ExpoPushMessage[] = tokens.map((token) => ({
    to: token,
    title: payload.title,
    body: payload.body,
    data: payload.data,
    sound: 'default',
    priority: 'high',
    channelId: 'default',
  }));

  const result = { sent: 0, failed: 0, invalidTokens: [] as string[] };

  // Expo recommends batches of max 100
  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100);

    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      if (!res.ok) {
        console.error('[Expo Push] HTTP error:', res.status, await res.text());
        result.failed += batch.length;
        continue;
      }

      const { data: tickets } = (await res.json()) as { data: ExpoPushTicket[] };

      for (let j = 0; j < tickets.length; j++) {
        const ticket = tickets[j];
        if (ticket.status === 'ok') {
          result.sent++;
        } else {
          result.failed++;
          if (ticket.details?.error === 'DeviceNotRegistered') {
            result.invalidTokens.push(batch[j].to);
          }
          console.warn('[Expo Push] Failed:', ticket.message, ticket.details);
        }
      }
    } catch (err) {
      console.error('[Expo Push] Send error:', err);
      result.failed += batch.length;
    }
  }

  return result;
}
