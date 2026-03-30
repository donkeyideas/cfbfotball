import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface APILogEntry {
  provider: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  response_time_ms?: number;
  tokens_used?: number;
  cost?: number;
  success: boolean;
  error_message?: string;
  request_metadata?: Record<string, unknown>;
}

export async function logAPICall(entry: APILogEntry) {
  try {
    await supabase.from('api_call_log').insert(entry);
  } catch (err) {
    console.error('Failed to log API call:', err);
  }
}

export async function withAPILogging<T>(
  provider: string,
  endpoint: string,
  fn: () => Promise<T>,
  options?: { method?: string }
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    await logAPICall({
      provider,
      endpoint,
      method: options?.method ?? 'GET',
      success: true,
      response_time_ms: Date.now() - start,
    });
    return result;
  } catch (err) {
    await logAPICall({
      provider,
      endpoint,
      method: options?.method ?? 'GET',
      success: false,
      response_time_ms: Date.now() - start,
      error_message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
