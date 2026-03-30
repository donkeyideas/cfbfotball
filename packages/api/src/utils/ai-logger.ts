import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface AILogEntry {
  feature: string;
  sub_type?: string;
  provider: string;
  model?: string;
  prompt_text?: string;
  response_text?: string;
  tokens_used?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  cost?: number;
  response_time_ms?: number;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export async function logAIInteraction(entry: AILogEntry) {
  try {
    await supabase.from('ai_interactions').insert(entry);
  } catch (err) {
    console.error('Failed to log AI interaction:', err);
  }
}

export async function withAILogging<T>(
  feature: string,
  provider: string,
  fn: () => Promise<T>,
  options?: { sub_type?: string; model?: string; prompt_text?: string }
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    await logAIInteraction({
      feature,
      provider,
      success: true,
      response_time_ms: Date.now() - start,
      ...options,
    });
    return result;
  } catch (err) {
    await logAIInteraction({
      feature,
      provider,
      success: false,
      response_time_ms: Date.now() - start,
      error_message: err instanceof Error ? err.message : String(err),
      ...options,
    });
    throw err;
  }
}
