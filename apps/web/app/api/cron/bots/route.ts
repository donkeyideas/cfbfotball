import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { runBotCycle } from '@/lib/admin/bots/engine';
import { updateBotMoods } from '@/lib/admin/bots/context-builder';
import { detectAndQueueEvents, consumeEventQueue } from '@/lib/admin/bots/event-detector';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  // Auth: CRON_SECRET, Vercel cron header, or dev mode bypass
  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[BOT CRON] Auth failed - no valid CRON_SECRET or Vercel header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`[BOT CRON] Starting cycle at ${new Date().toISOString()} (auth: ${vercelCron ? 'vercel' : isDev ? 'dev' : 'secret'})`);

  // Run the heavy work after responding so cron-job.org doesn't timeout
  after(async () => {
    const start = Date.now();
    try {
      const eventResult = await detectAndQueueEvents();
      const moodResult = await updateBotMoods();
      const consumeResult = await consumeEventQueue();
      const cycleResult = await runBotCycle();

      const elapsed = Date.now() - start;
      console.log(`[BOT CRON] Completed in ${elapsed}ms - posted: ${cycleResult.posted}, reacted: ${cycleResult.reacted}, replied: ${cycleResult.replied}, errors: ${cycleResult.errors.length}, events: ${eventResult.queued}/${consumeResult.consumed}, moods: ${moodResult.updated}`);
    } catch (error) {
      const elapsed = Date.now() - start;
      console.error(`[BOT CRON] Failed after ${elapsed}ms:`, error);
    }
  });

  return NextResponse.json({ accepted: true, message: 'Bot cycle queued' });
}
