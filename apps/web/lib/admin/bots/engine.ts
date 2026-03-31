// ============================================================
// Bot Engine - Core bot action functions
// Uses DeepSeek AI + Supabase service client
// ============================================================

import { createAdminClient } from '@/lib/admin/supabase/admin';
import { aiChat } from '@/lib/admin/ai/deepseek';
import { BOT_PRESETS, buildSystemPrompt, type BotPersonality } from './personalities';
import {
  fetchESPNCFBNews,
  cleanBotContent,
  pickRandom,
  shuffleArray,
  getRandomTemp,
  FALLBACK_TAKES,
  FALLBACK_REPLIES,
} from './content-utils';

interface BotProfile {
  id: string;
  username: string;
  display_name: string | null;
  bot_personality: Record<string, unknown> | null;
  bot_active: boolean | null;
  is_bot: boolean | null;
  school_id: string | null;
  school: {
    name: string;
    mascot: string;
    conference: string;
    primary_color: string;
    secondary_color: string;
    abbreviation: string;
  } | null;
}

// ============================================================
// Length variation (matches Basketball pattern)
// ============================================================

interface LengthConfig {
  tier: 'short' | 'medium' | 'long';
  maxChars: number;
  maxTokens: number;
  hint: string;
}

function getRandomPostLength(): LengthConfig {
  const roll = Math.random();
  if (roll < 0.3) {
    return {
      tier: 'short',
      maxChars: 280,
      maxTokens: 200,
      hint: 'Write a single short college football take (1-2 sentences, under 280 characters)',
    };
  } else if (roll < 0.65) {
    return {
      tier: 'medium',
      maxChars: 500,
      maxTokens: 400,
      hint: 'Your response MUST be 3-5 sentences long (around 300-480 characters). Expand on your point with supporting evidence, specific games, players, or stats',
    };
  } else {
    return {
      tier: 'long',
      maxChars: 500,
      maxTokens: 600,
      hint: 'Your response MUST be a full paragraph of 5-8 sentences (400-500 characters). Break down your argument thoroughly, reference specific stats, players, games. Make your full case',
    };
  }
}

function getRandomReplyLength(): LengthConfig {
  const roll = Math.random();
  if (roll < 0.4) {
    return { tier: 'short', maxChars: 200, maxTokens: 150, hint: 'Write a short reply (1 sentence, under 200 characters)' };
  } else if (roll < 0.75) {
    return { tier: 'medium', maxChars: 400, maxTokens: 300, hint: 'Your reply MUST be 2-4 sentences. Explain your reasoning and add your own perspective' };
  } else {
    return { tier: 'long', maxChars: 500, maxTokens: 400, hint: 'Your reply MUST be 4-6 sentences. Really engage with the take in depth' };
  }
}

// ============================================================
// Prompt building
// ============================================================

function buildTakePrompt(
  personality: BotPersonality,
  school: BotProfile['school'],
  context: string,
  newsContext: string
): { system: string; user: string; length: LengthConfig } {
  if (!school) throw new Error('Bot has no school assigned');

  const systemBase = buildSystemPrompt(personality, school);
  const lengthConfig = getRandomPostLength();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // 90% focus on own school
  const shouldFocusSchool = Math.random() < 0.9;
  const schoolDirective = shouldFocusSchool
    ? `\nThis take MUST be about ${school.name} and their current season. Talk about their roster, recent games, playoff chances, coaching decisions, rivalries, or recruiting.`
    : `\nThis time, talk about the broader college football landscape, other ${school.conference} teams, or league-wide topics. You can mention ${school.name} in passing.`;

  const system = `${systemBase}${schoolDirective}

Today is ${today}.

RULES:
- ${lengthConfig.hint}
- Sound natural and human - like a real fan posting on social media
- NO markdown formatting (no bold, italics, headers, backticks, bullet points)
- NO hashtags
- NO emojis
- Be opinionated and engaging
- NEVER start with "Alright", "Look,", "Listen,", "Let me tell you", "Here's the thing"
- Reference current events, recent games, or recent news when possible
- DO NOT write generic opinions - be specific about players, teams, and recent happenings
- NEVER repeat or paraphrase something already on the timeline
- Your take must be UNIQUE and ORIGINAL`;

  const user = `Given this context about college football RIGHT NOW, write a fresh take:\n\n${context}${newsContext}`;

  return { system, user, length: lengthConfig };
}

// ============================================================
// AI generation
// ============================================================

async function generateTakeContent(
  personality: BotPersonality,
  school: BotProfile['school'],
  context: string
): Promise<string | null> {
  const newsHeadlines = await fetchESPNCFBNews();
  const newsContext = newsHeadlines.length > 0
    ? '\n\nRecent college football headlines:\n' + newsHeadlines.map((h) => `- ${h}`).join('\n')
    : '';

  const { system, user, length } = buildTakePrompt(personality, school, context, newsContext);

  try {
    const raw = await aiChat(`${system}\n\n${user}`, {
      feature: 'bot_posts',
      subType: 'bot_take',
      temperature: getRandomTemp(0.8, 1.0),
      maxTokens: length.maxTokens,
    });
    const content = cleanBotContent(raw, length.maxChars);
    if (content.length > 10) return content;
  } catch (err) {
    console.error('[BOT] AI generation failed:', err instanceof Error ? err.message : err);
  }

  return null;
}

async function generateReplyContent(
  personality: BotPersonality,
  school: BotProfile['school'],
  targetContent: string
): Promise<string | null> {
  if (!school) return null;
  const length = getRandomReplyLength();
  const systemBase = buildSystemPrompt(personality, school);

  const prompt = `${systemBase}

You are replying to a post on a college football social media platform.

RULES:
- ${length.hint}
- Sound natural - like a real person commenting
- NO markdown formatting, NO emojis, NO hashtags
- NEVER start with "Alright", "Look,", "Listen,"
- Be engaging - agree, disagree, add context, or challenge the take

Reply to this take: "${targetContent}"`;

  try {
    const raw = await aiChat(prompt, {
      feature: 'bot_posts',
      subType: 'bot_reply',
      temperature: getRandomTemp(0.8, 1.0),
      maxTokens: length.maxTokens,
    });
    const content = cleanBotContent(raw, length.maxChars);
    if (content.length > 5) return content;
  } catch {
    // Fall through
  }

  return null;
}

// ============================================================
// Fallback content
// ============================================================

function getFallbackTake(personality: BotPersonality): string {
  const tone = personality.tone?.toLowerCase() || '';
  if (tone.includes('passion') || tone.includes('bias') || tone.includes('loyal')) return pickRandom(FALLBACK_TAKES.homer ?? FALLBACK_TAKES.default!);
  if (tone.includes('analyt') || tone.includes('data') || tone.includes('measured')) return pickRandom(FALLBACK_TAKES.analyst ?? FALLBACK_TAKES.default!);
  if (tone.includes('nostalg') || tone.includes('gruff')) return pickRandom(FALLBACK_TAKES.old_school ?? FALLBACK_TAKES.default!);
  if (tone.includes('bold') || tone.includes('provocat')) return pickRandom(FALLBACK_TAKES.hot_take ?? FALLBACK_TAKES.default!);
  if (tone.includes('excited') || tone.includes('insider')) return pickRandom(FALLBACK_TAKES.recruiting_insider ?? FALLBACK_TAKES.default!);
  return pickRandom(FALLBACK_TAKES.default!);
}

// ============================================================
// Core bot functions
// ============================================================

async function fetchBot(botId: string): Promise<BotProfile | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, username, display_name, bot_personality, bot_active, is_bot, school_id, school:schools!profiles_school_id_fkey(name, mascot, conference, primary_color, secondary_color, abbreviation)')
    .eq('id', botId)
    .eq('is_bot', true)
    .single();

  if (!data) return null;

  // Normalize school join (Supabase returns array for joins)
  const school = Array.isArray(data.school) ? data.school[0] : data.school;
  return { ...data, school } as unknown as BotProfile;
}

function parsePersonality(raw: unknown): BotPersonality {
  if (raw && typeof raw === 'object' && 'type' in raw) {
    const type = (raw as Record<string, unknown>).type as string;
    if (BOT_PRESETS[type]) return BOT_PRESETS[type]!;
  }
  return BOT_PRESETS.homer!;
}

/**
 * Generate and post a new take for a bot.
 */
export async function postBotTake(botId: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const supabase = createAdminClient();
  const bot = await fetchBot(botId);
  if (!bot || !bot.is_bot || !bot.bot_active) return { success: false, error: 'Bot not found or inactive' };

  const personality = parsePersonality(bot.bot_personality);

  // Gather context
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('content')
    .neq('author_id', botId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: ownPosts } = await supabase
    .from('posts')
    .select('content')
    .eq('author_id', botId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(10);

  let context = '';
  if (recentPosts?.length) {
    context += 'Recent takes on the timeline (DO NOT repeat):\n' + recentPosts.map((p) => `- ${p.content.slice(0, 150)}`).join('\n');
  }
  if (ownPosts?.length) {
    context += '\n\nYour own previous takes (MUST NOT repeat):\n' + ownPosts.map((p) => `- ${p.content.slice(0, 150)}`).join('\n');
  }

  // Try AI generation (2 attempts)
  let content = await generateTakeContent(personality, bot.school, context);
  if (!content) {
    content = await generateTakeContent(personality, bot.school, context);
  }

  // Fallback
  if (!content) {
    const toneFallbacks = (() => {
      const tone = personality.tone?.toLowerCase() || '';
      if (tone.includes('passion')) return FALLBACK_TAKES.homer ?? [];
      if (tone.includes('analyt')) return FALLBACK_TAKES.analyst ?? [];
      if (tone.includes('nostalg')) return FALLBACK_TAKES.old_school ?? [];
      if (tone.includes('bold')) return FALLBACK_TAKES.hot_take ?? [];
      if (tone.includes('insider')) return FALLBACK_TAKES.recruiting_insider ?? [];
      return FALLBACK_TAKES.default ?? [];
    })();
    const allFallbacks = shuffleArray([
      ...toneFallbacks,
      ...Object.values(FALLBACK_TAKES).flat(),
    ]);

    for (const candidate of allFallbacks) {
      const { data: exists } = await supabase
        .from('posts')
        .select('id')
        .eq('content', candidate)
        .eq('status', 'PUBLISHED')
        .limit(1);
      if (!exists?.length) {
        content = candidate;
        break;
      }
    }
  }

  if (!content) return { success: false, error: 'No unique content available' };

  // Duplicate check
  const { data: duplicate } = await supabase
    .from('posts')
    .select('id')
    .eq('content', content)
    .eq('status', 'PUBLISHED')
    .limit(1);
  if (duplicate?.length) return { success: false, error: 'Duplicate content' };

  // Insert post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      author_id: botId,
      content,
      post_type: 'TAKE',
      school_id: bot.school_id,
      status: 'PUBLISHED',
    })
    .select('id')
    .single();

  if (postError) return { success: false, error: postError.message };

  // Update last_active_at
  await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', botId);

  // Log activity
  await supabase.from('bot_activity_log').insert({
    bot_id: botId,
    action_type: 'POST',
    created_post_id: post.id,
    content_preview: content.slice(0, 200),
    success: true,
  });

  return { success: true, postId: post.id };
}

/**
 * React to recent posts (TOUCHDOWN or FUMBLE).
 */
export async function botReactToPosts(botId: string): Promise<{ success: boolean; count: number }> {
  const supabase = createAdminClient();
  const bot = await fetchBot(botId);
  if (!bot || !bot.is_bot || !bot.bot_active) return { success: false, count: 0 };

  const personality = parsePersonality(bot.bot_personality);

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, author_id')
    .neq('author_id', botId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!recentPosts?.length) return { success: true, count: 0 };

  let reactCount = 0;

  for (const post of recentPosts) {
    if (Math.random() > 0.25) continue; // 25% chance per post

    // Check if already reacted
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', botId)
      .eq('post_id', post.id)
      .limit(1);
    if (existing?.length) continue;

    // Determine reaction type based on personality bias
    let tdChance = 0.5;
    if (personality.reactionBias === 'touchdown_heavy') tdChance = 0.8;
    else if (personality.reactionBias === 'fumble_heavy') tdChance = 0.3;

    const reactionType = Math.random() < tdChance ? 'TOUCHDOWN' : 'FUMBLE';

    const { error } = await supabase
      .from('reactions')
      .insert({ user_id: botId, post_id: post.id, reaction_type: reactionType });

    if (!error) reactCount++;
    if (reactCount >= 5) break;
  }

  // Log activity
  if (reactCount > 0) {
    await supabase.from('bot_activity_log').insert({
      bot_id: botId,
      action_type: 'REACT',
      content_preview: `Reacted to ${reactCount} posts`,
      success: true,
    });
  }

  return { success: true, count: reactCount };
}

/**
 * Reply to a recent post with AI-generated content.
 */
export async function botReplyToPost(botId: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const supabase = createAdminClient();
  const bot = await fetchBot(botId);
  if (!bot || !bot.is_bot || !bot.bot_active) return { success: false, error: 'Bot inactive' };

  const personality = parsePersonality(bot.bot_personality);

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, content, author_id')
    .neq('author_id', botId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!recentPosts?.length) return { success: false, error: 'No posts to reply to' };

  for (const post of recentPosts) {
    if (Math.random() > 0.2) continue; // 20% chance per post

    // Check if already replied
    const { data: existingReply } = await supabase
      .from('posts')
      .select('id')
      .eq('author_id', botId)
      .eq('parent_id', post.id)
      .eq('status', 'PUBLISHED')
      .limit(1);
    if (existingReply?.length) continue;

    // Generate reply
    let replyContent = await generateReplyContent(personality, bot.school, post.content);

    if (!replyContent) {
      // Fallback
      const { data: existingReplies } = await supabase
        .from('posts')
        .select('content')
        .eq('parent_id', post.id)
        .eq('status', 'PUBLISHED');
      const usedContents = new Set((existingReplies ?? []).map((r) => r.content.toLowerCase().trim()));
      const unused = FALLBACK_REPLIES.find((f) => !usedContents.has(f.toLowerCase().trim()));
      if (!unused) continue;
      replyContent = unused;
    }

    const { data: reply, error } = await supabase
      .from('posts')
      .insert({
        author_id: botId,
        content: replyContent,
        post_type: 'TAKE',
        school_id: bot.school_id,
        parent_id: post.id,
        status: 'PUBLISHED',
      })
      .select('id')
      .single();

    if (error) return { success: false, error: error.message };

    // Update last_active_at
    await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', botId);

    // Log
    await supabase.from('bot_activity_log').insert({
      bot_id: botId,
      action_type: 'REPLY',
      target_post_id: post.id,
      created_post_id: reply.id,
      content_preview: replyContent.slice(0, 200),
      success: true,
    });

    return { success: true, postId: reply.id };
  }

  return { success: false, error: 'No suitable post to reply to' };
}

/**
 * Repost a popular post.
 */
export async function botRepostContent(botId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: popularPosts } = await supabase
    .from('posts')
    .select('id, author_id')
    .neq('author_id', botId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .gte('touchdown_count', 1)
    .order('touchdown_count', { ascending: false })
    .limit(5);

  if (!popularPosts?.length) return { success: false, error: 'No popular posts' };

  for (const post of popularPosts) {
    if (Math.random() > 0.15) continue; // 15% chance

    // Check if already reposted
    const { data: existing } = await supabase
      .from('reposts')
      .select('id')
      .eq('user_id', botId)
      .eq('post_id', post.id)
      .limit(1);
    if (existing?.length) continue;

    const { error } = await supabase
      .from('reposts')
      .insert({ user_id: botId, post_id: post.id });

    if (error) continue;

    // Update last_active_at
    await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', botId);

    // Log
    await supabase.from('bot_activity_log').insert({
      bot_id: botId,
      action_type: 'REPOST',
      target_post_id: post.id,
      success: true,
    });

    return { success: true };
  }

  return { success: false, error: 'No suitable post to repost' };
}

/**
 * Run one bot cycle: pick random active bots, execute probabilistic actions.
 */
export async function runBotCycle(): Promise<{
  success: boolean;
  globalActive: boolean;
  totalBots: number;
  selectedBots: string[];
  posted: number;
  reacted: number;
  replied: number;
  reposted: number;
  errors: string[];
}> {
  const supabase = createAdminClient();

  // Check global toggle
  const { data: setting } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', 'bots_global_active')
    .single();

  if (setting?.value !== 'true') {
    return { success: true, globalActive: false, totalBots: 0, selectedBots: [], posted: 0, reacted: 0, replied: 0, reposted: 0, errors: [] };
  }

  // Get active bots
  const { data: activeBots } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('is_bot', true)
    .eq('bot_active', true)
    .eq('status', 'ACTIVE');

  if (!activeBots?.length) {
    return { success: true, globalActive: true, totalBots: 0, selectedBots: [], posted: 0, reacted: 0, replied: 0, reposted: 0, errors: [] };
  }

  // Pick 2-4 random bots
  const maxBots = Math.min(4, activeBots.length);
  const numBots = Math.max(2, Math.floor(Math.random() * maxBots) + 1);
  const selectedBots = shuffleArray(activeBots).slice(0, numBots);

  let posted = 0;
  let reacted = 0;
  let replied = 0;
  let reposted = 0;
  const errors: string[] = [];

  for (const bot of selectedBots) {
    // 70% chance to post
    if (Math.random() < 0.7) {
      try {
        const result = await postBotTake(bot.id);
        if (result.success) posted++;
        else if (result.error) errors.push(`Post[${bot.username}]: ${result.error}`);
      } catch (err) {
        errors.push(`Post[${bot.username}]: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 60% chance to react
    if (Math.random() < 0.6) {
      try {
        const result = await botReactToPosts(bot.id);
        if (result.count > 0) reacted += result.count;
      } catch (err) {
        errors.push(`React[${bot.username}]: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 40% chance to reply
    if (Math.random() < 0.4) {
      try {
        const result = await botReplyToPost(bot.id);
        if (result.success) replied++;
      } catch (err) {
        errors.push(`Reply[${bot.username}]: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 25% chance to repost
    if (Math.random() < 0.25) {
      try {
        const result = await botRepostContent(bot.id);
        if (result.success) reposted++;
      } catch (err) {
        errors.push(`Repost[${bot.username}]: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  return {
    success: true,
    globalActive: true,
    totalBots: activeBots.length,
    selectedBots: selectedBots.map((b) => b.username),
    posted,
    reacted,
    replied,
    reposted,
    errors,
  };
}
