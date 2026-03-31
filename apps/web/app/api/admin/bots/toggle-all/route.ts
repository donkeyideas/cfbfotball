import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { toggleAllBots } from '@/lib/admin/actions/bots';

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { active } = body;

  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'active must be a boolean' }, { status: 400 });
  }

  const { error } = await toggleAllBots(active);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true, active });
}
