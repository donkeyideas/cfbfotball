import { NextRequest, NextResponse } from 'next/server';
import { runBotCycle } from '@/lib/admin/bots/engine';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  // Auth: CRON_SECRET or Vercel cron header
  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');

  if (!vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runBotCycle();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Bot cron failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
