import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SUBJECTS = ['general', 'bug', 'feature', 'partnership', 'other'];

const SUBJECT_TO_CATEGORY: Record<string, string> = {
  general: 'general',
  bug: 'bug_report',
  feature: 'feature_request',
  partnership: 'partnership',
  other: 'general',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || !VALID_SUBJECTS.includes(subject)) {
      return NextResponse.json({ error: 'Please select a valid subject.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (message.trim().length > 5000) {
      return NextResponse.json({ error: 'Message must be under 5000 characters.' }, { status: 400 });
    }

    const category = SUBJECT_TO_CATEGORY[subject] ?? 'general';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject,
        category,
        message: message.trim(),
        status: 'new',
      });

    if (insertError) {
      console.error('Contact submission insert error:', insertError);
      return NextResponse.json({ error: 'Failed to submit your message. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
