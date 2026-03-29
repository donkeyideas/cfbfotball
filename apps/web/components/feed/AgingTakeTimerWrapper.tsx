'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AgingTakeTimer } from '@/components/predictions/AgingTakeTimer';

export function AgingTakeTimerWrapper({ postId }: { postId: string }) {
  const [data, setData] = useState<{ revisit_date: string; is_surfaced: boolean } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('aging_takes')
      .select('revisit_date, is_surfaced')
      .eq('post_id', postId)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row) setData(row);
      });
  }, [postId]);

  if (!data) {
    return (
      <div className="aging-status">AWAITING JUDGMENT</div>
    );
  }

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <AgingTakeTimer revisitDate={data.revisit_date} isSurfaced={data.is_surfaced} />
    </div>
  );
}
