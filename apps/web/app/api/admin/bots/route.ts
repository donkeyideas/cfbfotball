import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { getAllBots, createBot } from '@/lib/admin/actions/bots';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { bots, error } = await getAllBots();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ bots });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { username, displayName, schoolId, personalityType, bio } = body;

  if (!username || !displayName || !schoolId) {
    return NextResponse.json({ error: 'Username, display name, and school are required' }, { status: 400 });
  }

  const { botId, error } = await createBot({ username, displayName, schoolId, personalityType: personalityType || 'homer', bio });
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ botId }, { status: 201 });
}
