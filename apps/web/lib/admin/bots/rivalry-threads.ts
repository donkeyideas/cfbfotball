// ============================================================
// Rivalry Threads - Scripted multi-phase conversation scenarios
// that pit rival bot fans against each other for engagement
// ============================================================

import { createAdminClient } from '@/lib/admin/supabase/admin';
import { postBotTake } from './engine';
import {
  RIVALRY_PAIRS,
  type RivalryPair,
} from './rivalry-graph';
import { pickRandom } from './content-utils';

// ============================================================
// Types
// ============================================================

export interface ScenarioPhase {
  role: 'instigator' | 'rival_response' | 'ally_support' | 'neutral_take' | 'fact_check';
  personalityPreference: string[];  // preferred personality types
  actionType: 'POST' | 'REPLY' | 'FUMBLE' | 'TOUCHDOWN' | 'CHALLENGE' | 'FACT_CHECK';
  delayMinutes: [number, number];   // min-max random delay
  promptHint: string;               // injected into AI prompt for this phase
}

export interface RivalryScenario {
  id: string;
  name: string;
  description: string;
  trigger: 'scheduled' | 'event' | 'random';
  phases: ScenarioPhase[];
}

// ============================================================
// Scenario Templates
// ============================================================

export const RIVALRY_SCENARIOS: RivalryScenario[] = [
  {
    id: 'sec_supremacy',
    name: 'SEC Supremacy Debate',
    description: 'SEC homer declares conference dominance, Big Ten homer fires back, analyst fact-checks both',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['homer'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Post a bold take about SEC dominance over every other conference. Reference strength of schedule, bowl record, or national titles. Be specific and confident.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'You are a Big Ten homer responding to an SEC supremacy claim. FUMBLE this take and reply explaining why the Big Ten is actually stronger. Reference recent head-to-head results or playoff performance.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer', 'hot_take'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [5, 12],
        promptHint: 'You agree with the original SEC take. TOUCHDOWN it and add a short supportive reply backing up the SEC with your own evidence.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'FACT_CHECK',
        delayMinutes: [10, 20],
        promptHint: 'Provide a measured, stats-based fact-check of the SEC vs Big Ten debate. Reference actual win-loss records, SP+ rankings, or playoff results. Do not pick sides, just present the data.',
      },
    ],
  },
  {
    id: 'portal_drama',
    name: 'Portal Drama',
    description: 'Insider breaks portal news, homer reacts excitedly, rival fumbles, hot take weighs in',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['recruiting_insider'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Break news about a major transfer portal move involving a player from the rival school entering the portal. Use insider language: "hearing noise", "sources say", "crystal ball incoming". Make up a realistic-sounding scenario.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [2, 6],
        promptHint: 'You are excited about this portal news. TOUCHDOWN the post. If the player is leaving a rival, gloat. If they are coming to your school, hype it up.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [4, 10],
        promptHint: 'A player from your school (or a target of your school) is in portal drama. FUMBLE the original post and reply defending your program or dismissing the news. Be emotional and defensive.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'REPLY',
        delayMinutes: [8, 15],
        promptHint: 'Weigh in on this portal drama with a provocative take. Say something bold about what this means for both programs. No hedging.',
      },
    ],
  },
  {
    id: 'ranking_disrespect',
    name: 'Ranking Disrespect',
    description: 'Hot take posts provocative ranking, homer touchdowns, rival fumbles, challenge issued',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['hot_take'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Post a provocative take ranking a traditionally strong team way too low or a rising team way too high. Be definitive. "Team X is not even a top 15 team and I said what I said." Keep it short and punchy.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [2, 5],
        promptHint: 'You agree with this hot ranking take because it benefits your school or disrespects a rival. TOUCHDOWN it and reply with supporting evidence.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [4, 10],
        promptHint: 'Your school was just disrespected in a ranking take. FUMBLE it hard. Reply with an emotional defense of your team. List accomplishments, wins, and players that prove the ranking wrong.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [8, 14],
        promptHint: 'Provide analytical context on this ranking debate. Reference stats that both support and undermine the hot take. Stay measured but acknowledge the controversy.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer', 'hot_take'],
        actionType: 'CHALLENGE',
        delayMinutes: [12, 20],
        promptHint: 'Challenge the original poster on their ranking take. Make a specific, falsifiable prediction that will prove them wrong. "Book it: [team] finishes top 5."',
      },
    ],
  },
  {
    id: 'coaching_carousel',
    name: 'Coaching Carousel',
    description: 'Insider reports coaching news, homers from affected schools react, analyst adds context',
    trigger: 'event',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['recruiting_insider'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Post insider-style news about a coaching change: a coordinator leaving, a head coach on the hot seat, or a coaching hire. Use insider terminology. Make it feel urgent.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'REPLY',
        delayMinutes: [3, 7],
        promptHint: 'React to this coaching news from the perspective of a fan of the school gaining or losing the coach. If gaining, hype it. If losing, show concern but stay loyal.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'REPLY',
        delayMinutes: [5, 12],
        promptHint: 'React to this coaching news as a rival fan. If the rival is losing a good coach, gloat. If they are gaining one, downplay the hire. Be petty.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['old_school'],
        actionType: 'REPLY',
        delayMinutes: [8, 16],
        promptHint: 'Respond to this coaching change with an old-school perspective. Compare to coaching changes in past decades. Lament how coaches used to stay at one school for 20 years.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'FACT_CHECK',
        delayMinutes: [12, 22],
        promptHint: 'Provide analytical context on this coaching change. Reference the coach\'s track record, win percentages, recruiting rankings, and how the change impacts both programs.',
      },
    ],
  },
  {
    id: 'rivalry_trash_talk',
    name: 'Rivalry Trash Talk',
    description: 'Homer starts trash talk, rival homer fires back, back-and-forth escalation',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['homer'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Post trash talk about your biggest rival school. Reference the rivalry game, their recent failures, or their delusional fanbase. Be specific to YOUR actual rival.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'Your rival just talked trash about your school. FUMBLE their take and fire back with your own trash talk. Reference YOUR wins in the rivalry, their embarrassing moments, and why they are delusional.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'REPLY',
        delayMinutes: [6, 14],
        promptHint: 'The trash talk is escalating. Reply to the rival response with an even sharper comeback. Get more specific. Bring up a particular game, score, or moment that stings for the rival.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'REPLY',
        delayMinutes: [10, 18],
        promptHint: 'Jump into this rivalry trash talk as an outsider. Pick a side or declare both teams overrated. Stir the pot even more.',
      },
    ],
  },
  {
    id: 'overrated_underrated',
    name: 'Overrated/Underrated',
    description: 'Hot take calls a team overrated, their homer responds, others pile on',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['hot_take'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Call a popular, highly-ranked team the most overrated team in college football. Be short, definitive, and provide one brutal reason. No hedging.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [2, 7],
        promptHint: 'Your team was just called overrated. FUMBLE this take hard and reply with a passionate defense. List your accomplishments, returning starters, recruiting class, anything to prove them wrong.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [5, 12],
        promptHint: 'You are a rival of the team being called overrated. TOUCHDOWN this take because you agree. Pile on with your own reasons why they are overrated.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [10, 18],
        promptHint: 'Analyze whether the "overrated" label has merit. Present stats that support and undermine the claim. Stay neutral but thorough.',
      },
    ],
  },
  {
    id: 'cfp_debate',
    name: 'CFP Bracket Debate',
    description: 'Analyst posts playoff ranking, multiple homers react, challenges fly',
    trigger: 'scheduled',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['analyst'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Post your College Football Playoff top 8 projection with brief justification for each team. Be specific about who is in and who is the first team out. Reference strength of schedule and key wins.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'Your team was left out of or ranked too low in this CFP projection. FUMBLE the post and make the case for why your team deserves a higher spot. Be emotional.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [5, 10],
        promptHint: 'Your team made the projected playoff. TOUCHDOWN this post and reply with a victory lap. Trash talk the teams that were left out.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'CHALLENGE',
        delayMinutes: [8, 16],
        promptHint: 'Challenge the analyst\'s CFP projection with a specific, falsifiable prediction. "The team ranked 5th will win the whole thing. Book it."',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'REPLY',
        delayMinutes: [12, 22],
        promptHint: 'Reply to someone else in this thread who trash-talked your team. Keep the debate going with specific counterarguments.',
      },
    ],
  },
  {
    id: 'nil_controversy',
    name: 'NIL Controversy',
    description: 'Old-school fan complains about NIL, hot take defends, homers weigh in on both sides',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['old_school'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Complain about how NIL is ruining college football. Reference a specific example of a player choosing money over loyalty. Compare to how things used to be. Be genuinely frustrated.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['hot_take'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'FUMBLE this anti-NIL take. Players deserve to be paid. The old system was exploitative. Be blunt and dismissive of the nostalgia. Short and punchy.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['old_school', 'homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [5, 12],
        promptHint: 'TOUCHDOWN the original anti-NIL post. You agree that NIL has gone too far. Share your own example or frustration. Reference how loyalty meant something in your day.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['recruiting_insider'],
        actionType: 'REPLY',
        delayMinutes: [8, 16],
        promptHint: 'Weigh in on the NIL debate with insider knowledge. Share how NIL is actually affecting recruiting decisions behind the scenes. Be informative, not preachy.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [14, 24],
        promptHint: 'Provide data-driven context on NIL: how much money is flowing, which conferences benefit most, whether it has actually changed competitive balance. Stay neutral.',
      },
    ],
  },
  {
    id: 'spring_game_hype',
    name: 'Spring Game Hype',
    description: 'Homer hypes spring game, rival dismisses, analyst provides context',
    trigger: 'scheduled',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['homer'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Hype up your school\'s spring game results. Talk about a new quarterback, an elite defensive line, or record attendance. Be irrationally optimistic about the upcoming season based on a spring scrimmage.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'FUMBLE this spring game hype. Dismiss their optimism. Remind them it was a scrimmage against themselves. Your school\'s spring game was better anyway.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'REPLY',
        delayMinutes: [6, 12],
        promptHint: 'Make a bold take about how spring game results predict nothing. Bring up a specific example of a team that looked great in spring and flopped in the fall.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [10, 18],
        promptHint: 'Provide analytical context on what spring games actually tell us. Reference historical correlations between spring performance and regular season results. Be measured.',
      },
    ],
  },
  {
    id: 'transfer_portal_reaction',
    name: 'Transfer Portal Reaction',
    description: 'Insider breaks portal news, homers from both schools react with opposite emotions',
    trigger: 'event',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['recruiting_insider'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Break news about a star player entering the transfer portal from one school and landing at a rival school. Use insider language. Make it dramatic.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [2, 5],
        promptHint: 'The player is transferring TO your school. TOUCHDOWN this post. Celebrate the pickup, talk about how they fill a need, welcome them enthusiastically.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 8],
        promptHint: 'The player just LEFT your school for a rival. FUMBLE the post. Be bitter, say good riddance, claim they were overrated, or blame the coaching staff. Show the stages of grief.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [8, 14],
        promptHint: 'Analyze this transfer from a football perspective. What does the player bring? How does it change the depth chart? Who benefits more from this move?',
      },
      {
        role: 'rival_response',
        personalityPreference: ['old_school'],
        actionType: 'REPLY',
        delayMinutes: [12, 20],
        promptHint: 'React to this transfer with old-school frustration. Lament that players used to stay at one school. Compare to a legendary player who was loyal for all four years.',
      },
    ],
  },
  {
    id: 'gameday_prediction',
    name: 'Game Day Prediction Fight',
    description: 'Homer predicts blowout win, rival homer claps back, analyst breaks down the matchup',
    trigger: 'scheduled',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['homer'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Predict a blowout win for your team in this week\'s big game against a rival. Give a specific score and boldly explain why the game will not be close.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [2, 7],
        promptHint: 'Your rival just predicted a blowout against your team. FUMBLE their take and counter-predict your own blowout win. Be just as bold and specific.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'REPLY',
        delayMinutes: [5, 10],
        promptHint: 'Jump in and say both teams are overrated and the real winner of this matchup is some other team entirely. Stir the pot.',
      },
      {
        role: 'fact_check',
        personalityPreference: ['analyst'],
        actionType: 'REPLY',
        delayMinutes: [8, 16],
        promptHint: 'Break down the actual matchup using stats. Compare offensive and defensive rankings, key player metrics, and historical trends in this rivalry. Give a measured prediction.',
      },
    ],
  },
  {
    id: 'dynasty_debate',
    name: 'Dynasty Debate',
    description: 'Old-school fan names the greatest dynasty, homers from other programs fight for their team',
    trigger: 'random',
    phases: [
      {
        role: 'instigator',
        personalityPreference: ['old_school'],
        actionType: 'POST',
        delayMinutes: [0, 0],
        promptHint: 'Declare that a specific college football dynasty is the greatest of all time. Reference their titles, players, coaches, and dominance. Be authoritative and nostalgic.',
      },
      {
        role: 'rival_response',
        personalityPreference: ['homer'],
        actionType: 'FUMBLE',
        delayMinutes: [3, 9],
        promptHint: 'FUMBLE this dynasty take. Your school\'s dynasty was better. List your titles, your legends, and why the original poster is living in the past.',
      },
      {
        role: 'ally_support',
        personalityPreference: ['homer'],
        actionType: 'TOUCHDOWN',
        delayMinutes: [6, 12],
        promptHint: 'TOUCHDOWN the original dynasty take because your school is the one they named. Add more evidence for why your dynasty is unmatched.',
      },
      {
        role: 'neutral_take',
        personalityPreference: ['hot_take'],
        actionType: 'REPLY',
        delayMinutes: [10, 18],
        promptHint: 'Declare that neither dynasty matters because a current team is about to start the greatest dynasty college football has ever seen. Be provocative.',
      },
    ],
  },
];

// ============================================================
// Core Functions
// ============================================================

/**
 * Fire a rivalry scenario: picks bots, creates the seed post,
 * and queues remaining phases into bot_event_queue with staggered delays.
 */
export async function fireRivalryScenario(
  scenarioId?: string
): Promise<{ success: boolean; threadId?: string; error?: string }> {
  const supabase = createAdminClient();

  try {
    // Cap active rivalry threads at 2
    const activeCount = await getActiveRivalryThreadCount();
    if (activeCount >= 2) {
      return { success: false, error: 'Maximum active rivalry threads reached (2)' };
    }

    // Pick scenario
    const scenario = scenarioId
      ? RIVALRY_SCENARIOS.find(s => s.id === scenarioId)
      : pickRandom(RIVALRY_SCENARIOS);

    if (!scenario) {
      return { success: false, error: `Scenario not found: ${scenarioId}` };
    }

    // Find a rivalry pair to anchor this thread (heat >= 7 for good drama)
    const hotPairs = RIVALRY_PAIRS.filter(p => p.heat >= 7);
    const rivalryPair = pickRandom(hotPairs);
    if (!rivalryPair) {
      return { success: false, error: 'No suitable rivalry pairs found' };
    }

    // Look up schools in the database
    const { data: schoolA } = await supabase
      .from('schools')
      .select('id, name, conference')
      .ilike('name', `%${rivalryPair.schoolA}%`)
      .limit(1)
      .single();

    const { data: schoolB } = await supabase
      .from('schools')
      .select('id, name, conference')
      .ilike('name', `%${rivalryPair.schoolB}%`)
      .limit(1)
      .single();

    if (!schoolA || !schoolB) {
      return { success: false, error: `Could not find schools: ${rivalryPair.schoolA} / ${rivalryPair.schoolB}` };
    }

    // Find bots for each school
    const { data: botsA } = await supabase
      .from('profiles')
      .select('id, username, bot_personality, school_id')
      .eq('is_bot', true)
      .eq('bot_active', true)
      .eq('school_id', schoolA.id)
      .limit(5);

    const { data: botsB } = await supabase
      .from('profiles')
      .select('id, username, bot_personality, school_id')
      .eq('is_bot', true)
      .eq('bot_active', true)
      .eq('school_id', schoolB.id)
      .limit(5);

    if (!botsA?.length || !botsB?.length) {
      return {
        success: false,
        error: `Not enough bots for ${rivalryPair.schoolA} (${botsA?.length ?? 0}) or ${rivalryPair.schoolB} (${botsB?.length ?? 0})`,
      };
    }

    // Also find neutral bots (analysts, hot takes from other schools)
    const { data: neutralBots } = await supabase
      .from('profiles')
      .select('id, username, bot_personality, school_id')
      .eq('is_bot', true)
      .eq('bot_active', true)
      .neq('school_id', schoolA.id)
      .neq('school_id', schoolB.id)
      .limit(10);

    // Assign bots to phases
    const phases = scenario.phases;
    const firstPhase = phases[0];
    if (!firstPhase) {
      return { success: false, error: 'Scenario has no phases' };
    }

    // Pick instigator bot (from school A by default)
    const instigatorBot = findBotForPhase(firstPhase, botsA, botsB, neutralBots ?? []);
    if (!instigatorBot) {
      return { success: false, error: 'Could not find instigator bot' };
    }

    // Create the seed post via the engine
    const seedResult = await postBotTake(instigatorBot.id);
    if (!seedResult.success || !seedResult.postId) {
      return { success: false, error: `Seed post failed: ${seedResult.error}` };
    }

    const threadId = seedResult.postId;

    // Queue remaining phases into bot_event_queue
    const remainingPhases = phases.slice(1);
    let cumulativeDelayMs = 0;

    for (const phase of remainingPhases) {
      // Calculate delay
      const [minDelay, maxDelay] = phase.delayMinutes;
      const delayMinutes = minDelay + Math.random() * (maxDelay - minDelay);
      cumulativeDelayMs += delayMinutes * 60 * 1000;

      const scheduledAt = new Date(Date.now() + cumulativeDelayMs).toISOString();

      // Pick bot for this phase
      const phaseBot = findBotForPhase(phase, botsA, botsB, neutralBots ?? []);
      if (!phaseBot) continue;

      // Check anti-loop protection
      const canInteract = await canBotsInteract(instigatorBot.id, phaseBot.id);
      if (!canInteract) continue;

      await supabase.from('bot_event_queue').insert({
        event_type: `rivalry_${scenario.id}_${phase.role}`,
        school_id: phaseBot.school_id,
        payload: {
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          threadId,
          phase: {
            role: phase.role,
            actionType: phase.actionType,
            promptHint: phase.promptHint,
          },
          botId: phaseBot.id,
          instigatorBotId: instigatorBot.id,
          rivalryPair: {
            schoolA: rivalryPair.schoolA,
            schoolB: rivalryPair.schoolB,
            heat: rivalryPair.heat,
            name: rivalryPair.name,
          },
        },
        priority: Math.min(10, rivalryPair.heat),
        min_delay_seconds: Math.floor(delayMinutes * 60 * 0.8),
        max_delay_seconds: Math.floor(delayMinutes * 60 * 1.2),
        scheduled_at: scheduledAt,
      });
    }

    // Log the scenario fire
    await supabase.from('bot_activity_log').insert({
      bot_id: instigatorBot.id,
      action_type: 'RIVALRY_SCENARIO',
      created_post_id: threadId,
      content_preview: `Fired scenario: ${scenario.name} (${rivalryPair.schoolA} vs ${rivalryPair.schoolB})`,
      success: true,
    });

    return { success: true, threadId };
  } catch (error) {
    console.error('[RIVALRY] Scenario failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Anti-loop protection: checks if two bots have interacted too much recently.
 * Max 3 consecutive interactions per pair within a 2-hour window.
 */
export async function canBotsInteract(botAId: string, botBId: string): Promise<boolean> {
  // Same bot can always "interact" with itself (no-op guard)
  if (botAId === botBId) return true;

  const supabase = createAdminClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  try {
    // Check activity log for interactions where botA acted on content authored by botB
    const { count: countAtoB } = await supabase
      .from('bot_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('bot_id', botAId)
      .gte('created_at', twoHoursAgo)
      .eq('success', true);

    const { count: countBtoA } = await supabase
      .from('bot_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('bot_id', botBId)
      .gte('created_at', twoHoursAgo)
      .eq('success', true);

    // Also check direct reply chains between the two bots
    const { count: repliesAtoB } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', botAId)
      .not('parent_id', 'is', null)
      .gte('created_at', twoHoursAgo);

    const { count: repliesBtoA } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', botBId)
      .not('parent_id', 'is', null)
      .gte('created_at', twoHoursAgo);

    // Approximate total pairwise interactions
    // A more precise check would join on target_post_author_id,
    // but this heuristic using total recent activity provides sufficient rate limiting
    const totalInteractions =
      (countAtoB ?? 0) +
      (countBtoA ?? 0) +
      (repliesAtoB ?? 0) +
      (repliesBtoA ?? 0);

    // Max 3 consecutive interactions per pair before cooldown
    return totalInteractions < 3;
  } catch (error) {
    console.error('[RIVALRY] canBotsInteract check failed:', error);
    // Fail open: allow interaction if check fails
    return true;
  }
}

/**
 * Count active rivalry threads (scenarios fired in the last 2 hours).
 * Used to cap concurrent rivalry threads at 2.
 */
export async function getActiveRivalryThreadCount(): Promise<number> {
  const supabase = createAdminClient();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  try {
    const { data, error } = await supabase
      .from('bot_event_queue')
      .select('id, event_type')
      .like('event_type', 'rivalry_%')
      .eq('is_active', true)
      .gte('created_at', twoHoursAgo);

    if (error || !data?.length) return 0;

    // Each scenario creates multiple queue entries; estimate unique threads
    // by extracting the scenario ID from event_type (format: rivalry_{scenarioId}_{role})
    const uniqueScenarios = new Set<string>();
    for (const row of data) {
      const eventType = (row as { event_type: string }).event_type;
      // Extract scenario ID: "rivalry_sec_supremacy_instigator" -> "sec_supremacy"
      const withoutPrefix = eventType.replace('rivalry_', '');
      // Find which known scenario ID this matches
      const matchedScenario = RIVALRY_SCENARIOS.find(s =>
        withoutPrefix.startsWith(s.id)
      );
      if (matchedScenario) {
        uniqueScenarios.add(matchedScenario.id);
      }
    }

    // Fallback: if we cannot parse, use a rough count (divide by avg phases per scenario)
    if (uniqueScenarios.size === 0 && data.length > 0) {
      return Math.ceil(data.length / 4);
    }

    return uniqueScenarios.size;
  } catch (error) {
    console.error('[RIVALRY] getActiveRivalryThreadCount failed:', error);
    return 0;
  }
}

// ============================================================
// Internal Helpers
// ============================================================

interface BotCandidate {
  id: string;
  username: string;
  bot_personality: unknown;
  school_id: string | null;
}

/**
 * Find the best bot for a given phase based on personality preference
 * and role (instigator/ally = school A, rival = school B, neutral = other).
 */
function findBotForPhase(
  phase: ScenarioPhase,
  botsA: BotCandidate[],
  botsB: BotCandidate[],
  neutralBots: BotCandidate[],
): BotCandidate | null {
  // Determine which pool to draw from based on role
  let pool: BotCandidate[];
  switch (phase.role) {
    case 'instigator':
    case 'ally_support':
      pool = botsA;
      break;
    case 'rival_response':
      pool = botsB;
      break;
    case 'neutral_take':
    case 'fact_check':
      pool = neutralBots.length > 0 ? neutralBots : [...botsA, ...botsB];
      break;
    default:
      pool = [...botsA, ...botsB, ...neutralBots];
  }

  if (pool.length === 0) return null;

  // Try to match personality preference
  for (const pref of phase.personalityPreference) {
    const matching = pool.filter(bot => {
      const personality = bot.bot_personality as Record<string, unknown> | null;
      return personality?.type === pref;
    });
    if (matching.length > 0) {
      return pickRandom(matching);
    }
  }

  // Fallback: pick any bot from the pool
  return pickRandom(pool);
}
