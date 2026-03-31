import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { triggerBotPost } from '@/lib/admin/actions/bots';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const { postId, error } = await triggerBotPost(id);

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true, postId });
}
