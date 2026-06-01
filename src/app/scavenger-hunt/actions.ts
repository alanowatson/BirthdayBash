'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import { revalidatePath } from 'next/cache';

export async function toggleClaimAction(formData: FormData) {
  // Auth check
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');

  // Admin check
  const { data: member } = await supabaseAdmin
    .from('members')
    .select('is_admin, name')
    .eq('email', user.email)
    .maybeSingle();
  if (!member?.is_admin) throw new Error('Not authorized');

  const id = formData.get('id') as string;
  const isClaimed = formData.get('is_claimed') === 'true';

  await supabaseAdmin
    .from('scavenger_tasks')
    .update({
      is_claimed: isClaimed,
      claimed_by: isClaimed ? member.name : null,
    })
    .eq('id', id);

  revalidatePath('/scavenger-hunt');
}
