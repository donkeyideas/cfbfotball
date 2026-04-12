import { NextRequest, NextResponse } from 'next/server';
import { runBotCycle } from '@/lib/admin/bots/engine';
import { updateBotMoods } from '@/lib/admin/bots/context-builder';
import { detectAndQueueEvents, consumeEventQueue } from '@/lib/admin/bots/event-detector';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const start = Date.now();

  // Auth: CRON_SECRET, Vercel cron header, or dev mode bypass
  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[BOT CRON] Auth failed - no valid CRON_SECRET or Vercel header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`[BOT CRON] Starting cycle at ${new Date().toISOString()} (auth: ${vercelCron ? 'vercel' : isDev ? 'dev' : 'secret'})`);

  try {
    // Phase 1: Detect events and queue them (game state, portal, user mentions)
    const eventResult = await detectAndQueueEvents();

    // Phase 2: Update bot moods based on game results
    const moodResult = await updateBotMoods();

    // Phase 3: Consume event queue (event-driven reactions)
    const consumeResult = await consumeEventQueue();

    // Phase 4: Run ambient bot cycle (fills gaps when no events fire)
    const cycleResult = await runBotCycle();

    const elapsed = Date.now() - start;
    console.log(`[BOT CRON] Completed in ${elapsed}ms - posted: ${cycleResult.posted}, reacted: ${cycleResult.reacted}, replied: ${cycleResult.replied}, errors: ${cycleResult.errors.length}`);

    return NextResponse.json({
      ...cycleResult,
      eventsQueued: eventResult.queued,
      eventsConsumed: consumeResult.consumed,
      eventActions: consumeResult.actionsExecuted,
      moodsUpdated: moodResult.updated,
      elapsedMs: elapsed,
    });
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(`[BOT CRON] Failed after ${elapsed}ms:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error', elapsedMs: elapsed },
      { status: 500 }
    );
  }
}
