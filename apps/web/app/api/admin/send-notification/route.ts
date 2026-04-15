import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createAdminClient } from '@/lib/admin/supabase/admin';
import { sendPushToAudience, sendPushToUser } from '@/lib/firebase/send';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('cookie');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, body, targetAudience, targetId } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body required' }, { status: 400 });
    }

    // Test mode — send only to the requesting admin (fast, no after() needed)
    if (targetAudience === 'test') {
      const pushResult = await sendPushToUser(user.id, {
        title,
        body,
        data: { type: 'SYSTEM' },
      });

      await supabase.from('notifications').insert({
        recipient_id: user.id,
        type: 'SYSTEM',
        data: { message: body, title },
      });

      return NextResponse.json({
        success: true,
        sent: pushResult.sent,
        failed: pushResult.failed,
      });
    }

    // Create system notification record
    const { data: sysNotif, error: insertError } = await supabase
      .from('system_notifications')
      .insert({
        title,
        body,
        target_audience: targetAudience || 'all',
        target_id: targetId || null,
        created_by: user.id,
        status: 'sending',
      })
      .select()
      .single();

    if (insertError || !sysNotif) {
      console.error('[Send Notification] Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    // Respond immediately, do heavy work (push + in-app inserts) in after()
    after(async () => {
      try {
        const adminClient = createAdminClient();

        // Send push notifications to audience
        const result = await sendPushToAudience(
          { title, body, data: { type: 'SYSTEM' } },
          {
            systemNotificationId: sysNotif.id,
            targetAudience: targetAudience || 'all',
            targetId: targetId || undefined,
          }
        );

        // Create in-app SYSTEM notifications for the target audience (exclude bots)
        let userQuery = adminClient.from('profiles').select('id').or('is_bot.is.null,is_bot.eq.false');
        if (targetAudience === 'school' && targetId) {
          userQuery = userQuery.eq('school_id', targetId);
        } else if (targetAudience === 'conference' && targetId) {
          const { data: schools } = await adminClient
            .from('schools')
            .select('id')
            .eq('conference', targetId);
          if (schools && schools.length > 0) {
            userQuery = userQuery.in('school_id', schools.map((s) => s.id));
          }
        }

        const { data: targetUsers } = await userQuery;
        if (targetUsers && targetUsers.length > 0) {
          for (let i = 0; i < targetUsers.length; i += 1000) {
            const batch = targetUsers.slice(i, i + 1000).map((u) => ({
              recipient_id: u.id,
              type: 'SYSTEM',
              data: { message: body, title, system_notification_id: sysNotif.id },
            }));
            await adminClient.from('notifications').insert(batch);
          }
        }

        // Update system notification with results
        await adminClient
          .from('system_notifications')
          .update({
            status: 'sent',
            sent_count: result.sent,
            failed_count: result.failed,
            sent_at: new Date().toISOString(),
          })
          .eq('id', sysNotif.id);

        console.log(`[Send Notification] "${title}" — push: ${result.sent} sent, ${result.failed} failed, ${targetUsers?.length ?? 0} in-app`);
        if (result.sent === 0 && result.failed === 0) {
          console.warn('[Send Notification] No push notifications sent. Check: 1) FIREBASE_SERVICE_ACCOUNT configured? 2) Users have active device_tokens? 3) notification_preferences allow push?');
        }
      } catch (err) {
        console.error('[Send Notification] Background error:', err);
      }
    });

    return NextResponse.json({
      success: true,
      id: sysNotif.id,
      sent: 0,
      failed: 0,
      queued: true,
    });
  } catch (err) {
    console.error('[Send Notification] Error:', err);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
