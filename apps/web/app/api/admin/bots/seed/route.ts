import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { seedBots } from '@/lib/admin/bots/seed';

export const maxDuration = 300; // 5 minutes for seeding 100 bots

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { created, errors } = await seedBots();

    if (created === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    return NextResponse.json({ success: true, created, errors: errors.length > 0 ? errors : undefined });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    );
  }
}
