'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function batchRsvpAction(formData: FormData) {
  const memberId = formData.get('member_id') as string;
  const slug = formData.get('slug') as string;
  const selectionsJson = (formData.get('selections') as string) ?? '{}';

  let selections: Record<string, string> = {};
  try {
    selections = JSON.parse(selectionsJson);
  } catch {
    // malformed JSON — just redirect
  }

  const rows = Object.entries(selections)
    .filter(([, status]) => status === 'attending' || status === 'maybe')
    .map(([event_id, status]) => ({ member_id: memberId, event_id, status }));

  if (rows.length > 0) {
    await supabaseAdmin
      .from('rsvps')
      .upsert(rows, { onConflict: 'member_id,event_id' });
  }

  redirect(`/members/${slug}`);
}
