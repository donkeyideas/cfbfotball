// ============================================================
// Content Analyzer - Uses DeepSeek API via OpenAI SDK
// ============================================================

import OpenAI from 'openai';
import type { ModerationResult } from '@cfb-social/types';
import { MODERATION_SYSTEM_PROMPT } from './classifier';

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
export async function analyzeContent(content: string): Promise<ModerationResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com',
  });

  const response = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: MODERATION_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Analyze this post:\n\n"${content}"`,
      },
    ],
    temperature: 0.1, // Low temperature for consistent classification
    max_tokens: 512,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from DeepSeek moderation API');
  }

  const parsed = JSON.parse(text) as {
    labels: Record<string, number>;
    risk_score: number;
    reason: string;
    action: string;
  };

  // Validate and normalize the response
  const score = Math.max(0, Math.min(1, parsed.risk_score ?? 0));
  const labels = parsed.labels ?? {};
  const reason = parsed.reason ?? 'No reason provided';

  // Determine action based on score thresholds
  let action: ModerationResult['action'];
  if (score < 0.4) {
    action = 'ALLOW';
  } else if (score < 0.7) {
    action = 'FLAG';
  } else {
    action = 'REJECT';
  }

  return {
    score,
    labels,
    reason,
    action,
  };
}
