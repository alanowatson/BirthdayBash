'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function batchSignupRsvpsAction(_prev: null, formData: FormData): Promise<null> {
  const memberId = formData.get('member_id') as string;
  const event_ids = formData.getAll('event_ids') as string[];

  for (const event_id of event_ids) {
    const raw = formData.get(`rsvp_${event_id}`);
    const status = typeof raw === 'string' ? raw : 'none';

    if (status === 'none') {
      await supabaseAdmin
        .from('rsvps')
        .delete()
        .eq('member_id', memberId)
        .eq('event_id', event_id);
    } else {
      await supabaseAdmin
        .from('rsvps')
        .upsert({ member_id: memberId, event_id, status }, { onConflict: 'member_id,event_id' });
    }
  }

  redirect('/signup/travel');
}
