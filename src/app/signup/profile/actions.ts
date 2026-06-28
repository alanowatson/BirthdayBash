'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

export type ProfileSetupState = { error: string } | null;

export async function saveSignupProfileAction(
  _prev: ProfileSetupState,
  formData: FormData
): Promise<ProfileSetupState> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect('/signup');

  const bio = (formData.get('bio') as string)?.trim() || null;
  const obsession = (formData.get('obsession') as string)?.trim() || null;
  const tshirt_size = (formData.get('tshirt_size') as string)?.trim() || null;

  const { error } = await supabaseAdmin
    .from('members')
    .update({ bio, obsession, tshirt_size })
    .eq('email', user.email);

  if (error) return { error: 'Failed to save. Please try again.' };

  redirect('/signup/events');
}
