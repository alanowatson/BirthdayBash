'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');
  const { data: member } = await supabaseAdmin
    .from('members')
    .select('is_admin')
    .eq('email', user.email)
    .maybeSingle();
  if (!member?.is_admin) throw new Error('Not authorized');
}

export async function toggleAdminAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const current = formData.get('current') === 'true';
  await supabaseAdmin.from('members').update({ is_admin: !current }).eq('id', id);
  revalidatePath('/admin/members');
}

export async function toggleRefereeAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const current = formData.get('current') === 'true';
  await supabaseAdmin.from('members').update({ is_referee: !current }).eq('id', id);
  revalidatePath('/admin/members');
}

export async function deleteMemberAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  await supabaseAdmin.from('members').delete().eq('id', id);
  revalidatePath('/admin/members');
}

export async function setTripRsvpAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const value = formData.get('value') as string;
  const trip_rsvp = value === 'yes' || value === 'no' ? value : null;
  await supabaseAdmin.from('members').update({ trip_rsvp }).eq('id', id);
  revalidatePath('/admin/members');
}
