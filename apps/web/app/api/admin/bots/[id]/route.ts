import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { updateBot, deleteBot } from '@/lib/admin/actions/bots';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const body = await request.json();

  const { error } = await updateBot(id, body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const { error } = await deleteBot(id);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
