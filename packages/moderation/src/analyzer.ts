// ============================================================
// Content Analyzer - Uses DeepSeek API via OpenAI SDK
// ============================================================

import OpenAI from 'openai';
import type { ModerationResult } from '@cfb-social/types';
import { MODERATION_SYSTEM_PROMPT } from './classifier';

/**
 * Log an AI interaction to the ai_interactions and ai_moderation_log tables.
 * Fire-and-forget: never throws, never blocks the caller.
 */
async function logModerationCall(params: {
  postId?: string;
  userId?: string;
  promptText: string;
  responseText: string | null;
  tokensUsed: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  responseTimeMs: number;
  success: boolean;
  errorMessage?: string;
  moderationScore?: number;
  categoryScores?: Record<string, number>;
  actionTaken?: string;
}) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return;

    const supabase = createClient(supabaseUrl, serviceKey);

    // Log to ai_interactions
    await supabase.from('ai_interactions').insert({
      feature: 'content_moderation',
      sub_type: 'post_moderation',
      provider: 'deepseek',
      model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
      prompt_text: params.promptText.substring(0, 2000),
      response_text: params.responseText?.substring(0, 5000) ?? null,
      tokens_used: params.tokensUsed,
      prompt_tokens: params.promptTokens,
      completion_tokens: params.completionTokens,
      cost: params.cost,
      response_time_ms: params.responseTimeMs,
      success: params.success,
      error_message: params.errorMessage ?? null,
      metadata: params.postId ? { post_id: params.postId } : {},
    });

    // Log to ai_moderation_log
    if (params.moderationScore !== undefined) {
      await supabase.from('ai_moderation_log').insert({
        post_id: params.postId ?? null,
        user_id: params.userId ?? null,
        provider: 'deepseek',
        prompt_text: params.promptText.substring(0, 2000),
        response_text: params.responseText?.substring(0, 5000) ?? null,
        moderation_score: params.moderationScore,
        category_scores: params.categoryScores ?? {},
        action_taken: params.actionTaken ?? 'ALLOW',
        tokens_used: params.tokensUsed,
        cost: params.cost,
        response_time_ms: params.responseTimeMs,
        success: params.success,
      });
    }
  } catch {
    // Silent fail -- logging should never break moderation
  }
}

/**
 * Analyze content using DeepSeek API for CFB-specific content moderation.
 *
 * The DeepSeek API is OpenAI-compatible, so we use the openai SDK with
 * a custom baseURL pointing to DeepSeek's endpoint.
 *
 * Environment variables required:
 *   DEEPSEEK_API_KEY - Your DeepSeek API key
 *   DEEPSEEK_BASE_URL - (optional) Defaults to https://api.deepseek.com
 */
export async function analyzeContent(
  content: string,
  context?: { postId?: string; userId?: string },
): Promise<ModerationResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com',
  });

  const promptText = `Analyze this post:\n\n"${content}"`;
  const startTime = Date.now();
  let responseText: string | null = null;

  try {
    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: MODERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      temperature: 0.1,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error('Empty response from DeepSeek moderation API');
    }
    responseText = text;

    const parsed = JSON.parse(text) as {
      labels: Record<string, number>;
      risk_score: number;
      reason: string;
      action: string;
    };

    const score = Math.max(0, Math.min(1, parsed.risk_score ?? 0));
    const labels = parsed.labels ?? {};
    const reason = parsed.reason ?? 'No reason provided';

    let action: ModerationResult['action'];
    if (score < 0.4) {
      action = 'ALLOW';
    } else if (score < 0.7) {
      action = 'FLAG';
    } else {
      action = 'REJECT';
    }

    const elapsed = Date.now() - startTime;
    const promptTokens = response.usage?.prompt_tokens ?? 0;
    const completionTokens = response.usage?.completion_tokens ?? 0;
    const totalTokens = response.usage?.total_tokens ?? promptTokens + completionTokens;
    const cost = totalTokens * 0.000002;

    // Fire-and-forget logging
    logModerationCall({
      postId: context?.postId,
      userId: context?.userId,
      promptText,
      responseText,
      tokensUsed: totalTokens,
      promptTokens,
      completionTokens,
      cost,
      responseTimeMs: elapsed,
      success: true,
      moderationScore: score,
      categoryScores: labels,
      actionTaken: action,
    });

    return { score, labels, reason, action };
  } catch (err) {
    const elapsed = Date.now() - startTime;

    // Log the failure
    logModerationCall({
      postId: context?.postId,
      userId: context?.userId,
      promptText,
      responseText,
      tokensUsed: 0,
      promptTokens: 0,
      completionTokens: 0,
      cost: 0,
      responseTimeMs: elapsed,
      success: false,
      errorMessage: err instanceof Error ? err.message : String(err),
    });

    throw err;
  }
}
