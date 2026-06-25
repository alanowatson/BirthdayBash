'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import { revalidatePath } from 'next/cache';

function vegasToUTC(local: string | null): string | null {
  if (!local) return null;
  return new Date(local + ':00-07:00').toISOString();
}

export async function upsertTravelAction(formData: FormData) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');

  const { data: me } = await supabaseAdmin
    .from('members')
    .select('id, is_admin')
    .eq('email', user.email)
    .maybeSingle();
  if (!me) throw new Error('Member not found');

  const targetMemberId = formData.get('member_id') as string;
  // Non-admins can only update their own row
  const memberId = me.is_admin ? targetMemberId : me.id;

  const mode = formData.get('travel_mode') as 'flying' | 'driving';

  const row = {
    member_id: memberId,
    travel_mode: mode,
    arrives_at:       vegasToUTC(formData.get('arrives_at') as string || null),
    arrival_airline:  mode === 'flying' ? (formData.get('arrival_airline') as string || null) : null,
    arrival_flight:   mode === 'flying' ? (formData.get('arrival_flight') as string || null) : null,
    departs_at:       vegasToUTC(formData.get('departs_at') as string || null),
    departure_airline: mode === 'flying' ? (formData.get('departure_airline') as string || null) : null,
    departure_flight:  mode === 'flying' ? (formData.get('departure_flight') as string || null) : null,
    accommodation: formData.get('accommodation') as string || null,
    notes: formData.get('notes') as string || null,
    updated_at: new Date().toISOString(),
  };

  await supabaseAdmin.from('travel').upsert(row, { onConflict: 'member_id' });
  revalidatePath('/travel');
}

export async function deleteTravelAction(formData: FormData) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');

  const { data: me } = await supabaseAdmin
    .from('members')
    .select('id, is_admin')
    .eq('email', user.email)
    .maybeSingle();
  if (!me) throw new Error('Member not found');

  const targetMemberId = formData.get('member_id') as string;
  const memberId = me.is_admin ? targetMemberId : me.id;

  await supabaseAdmin.from('travel').delete().eq('member_id', memberId);
  revalidatePath('/travel');
}
