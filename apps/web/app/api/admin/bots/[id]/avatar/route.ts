import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { createAdminClient } from '@/lib/admin/supabase/admin';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const supabase = createAdminClient();

  // Verify bot exists
  const { data: bot } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .eq('is_bot', true)
    .single();

  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 });

  try {
    const body = await request.json();
    const { image, mimeType } = body;

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Image data required' }, { status: 400 });
    }

    // Decode base64 and upload
    const buffer = Buffer.from(image, 'base64');
    const ext = mimeType.split('/')[1] || 'png';
    const filePath = `${id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, { upsert: true, contentType: mimeType });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = urlData.publicUrl;

    // Update profile
    await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', id);

    return NextResponse.json({ avatarUrl });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 });
  }
}
