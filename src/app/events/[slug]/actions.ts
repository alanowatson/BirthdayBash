'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

export type RsvpState =
  | { success: true; memberName: string; status: string }
  | { error: string }
  | null;

export async function rsvpAction(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const eventId  = (formData.get('event_id')  as string | null) ?? '';
  const status   = (formData.get('status')    as string | null) ?? '';
  const memberId = (formData.get('member_id') as string | null)?.trim() ?? '';
  const email    = (formData.get('email')     as string | null)?.trim().toLowerCase() ?? '';

  if (!eventId || !status) return { error: 'Missing required fields.' };

  const validStatuses = ['attending', 'maybe', 'not_attending'];
  if (!validStatuses.includes(status)) return { error: 'Invalid status.' };

  let member: { id: string; name: string } | null = null;

  if (memberId) {
    // Logged-in path — resolve by ID directly
    const { data } = await supabaseAdmin
      .from('members')
      .select('id, name')
      .eq('id', memberId)
      .maybeSingle();
    member = data;
  } else if (email) {
    // Unauthenticated path — resolve by email
    const { data } = await supabaseAdmin
      .from('members')
      .select('id, name')
      .eq('email', email)
      .maybeSingle();
    member = data;
  }

  if (!member) {
    return { error: "You're not on the guest list yet. Sign up at /signup first." };
  }

  const { error } = await supabaseAdmin.from('rsvps').upsert(
    { member_id: member.id, event_id: eventId, status },
    { onConflict: 'member_id,event_id' }
  );

  if (error) return { error: 'Something went wrong. Try again.' };

  const label: Record<string, string> = {
    attending:     'Attending',
    maybe:         'Maybe',
    not_attending: 'Not attending',
  };

  return { success: true, memberName: member.name, status: label[status] };
}
