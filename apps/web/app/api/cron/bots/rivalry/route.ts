import { NextRequest, NextResponse } from 'next/server';
import { fireRivalryScenario, getActiveRivalryThreadCount } from '@/lib/admin/bots/rivalry-threads';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Rivalry thread cron (every 3 hours).
 * Seeds one rivalry conversation between bots from different schools.
 * Skips if there are already 2+ active rivalry threads.
 */
export async function GET(request: NextRequest) {
  const start = Date.now();

  // Auth: CRON_SECRET, Vercel cron header, or dev mode bypass
  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[BOT RIVALRY] Auth failed - no valid CRON_SECRET or Vercel header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`[BOT RIVALRY] Starting rivalry cycle at ${new Date().toISOString()} (auth: ${vercelCron ? 'vercel' : isDev ? 'dev' : 'secret'})`);

  try {
    // Check active thread count - skip if >= 2 active
    const activeCount = await getActiveRivalryThreadCount();
    if (activeCount >= 2) {
      const elapsed = Date.now() - start;
      console.log(`[BOT RIVALRY] Skipped - ${activeCount} active threads already (max 2)`);
      return NextResponse.json({
        skipped: true,
        reason: 'max_active_threads',
        activeThreads: activeCount,
        elapsedMs: elapsed,
      });
    }

    // Fire a rivalry scenario
    const result = await fireRivalryScenario();

    const elapsed = Date.now() - start;
    console.log(`[BOT RIVALRY] Completed in ${elapsed}ms - success: ${result.success}, thread: ${result.threadId ?? 'none'}`);

    return NextResponse.json({
      ...result,
      activeThreadsBefore: activeCount,
      elapsedMs: elapsed,
    });
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(`[BOT RIVALRY] Failed after ${elapsed}ms:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error', elapsedMs: elapsed },
      { status: 500 }
    );
  }
}
