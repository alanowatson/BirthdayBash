'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

export type ProfileState = { success: true } | { error: string } | null;
export type MagicLinkState = { success: true; email: string } | { error: string } | null;
export type PhotoState = { success: true; url: string } | { error: string } | null;

export async function signOutAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function bulkUpdateUserRsvpsAction(formData: FormData) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return;

  const { data: member } = await supabaseAdmin
    .from('members')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();
  if (!member) return;

  const event_ids = formData.getAll('event_ids') as string[];

  for (const event_id of event_ids) {
    const raw = formData.get(`rsvp_${event_id}`);
    const status = typeof raw === 'string' ? raw : 'none';

    if (status === 'none') {
      await supabaseAdmin.from('rsvps').delete()
        .eq('member_id', member.id).eq('event_id', event_id);
    } else {
      await supabaseAdmin.from('rsvps').upsert(
        { member_id: member.id, event_id, status },
        { onConflict: 'member_id,event_id' }
      );
    }
  }

  revalidatePath('/me');
  revalidatePath('/');
  redirect('/me');
}

export async function updateProfileAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return { error: 'Not signed in.' };

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const bio = (formData.get('bio') as string | null)?.trim() || null;
  const obsession = (formData.get('obsession') as string | null)?.trim() || null;
  const tshirt_size = (formData.get('tshirt_size') as string | null)?.trim() || null;

  if (!name) return { error: 'Name is required.' };

  const { error } = await supabaseAdmin
    .from('members')
    .update({ name, bio, obsession, tshirt_size })
    .eq('email', user.email);

  if (error) return { error: 'Update failed. Try again.' };

  revalidatePath('/me');
  return { success: true };
}

export async function sendMagicLinkAction(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';

  if (!email) return { error: 'Email is required.' };

  const { data: member } = await supabaseAdmin
    .from('members')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (!member) {
    return { error: "No account found. Sign up first at /signup." };
  }

  const supabase = await createAuthClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) return { error: 'Failed to send email. Try again.' };

  return { success: true, email };
}

export async function uploadPhotoAction(_prev: PhotoState, formData: FormData): Promise<PhotoState> {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Not signed in.' };

  const file = formData.get('photo') as File | null;
  if (!file || file.size === 0) return { error: 'No file selected.' };
  if (file.size > 5 * 1024 * 1024) return { error: 'File must be under 5MB.' };
  if (!file.type.startsWith('image/')) return { error: 'Must be an image file.' };

  const { data: member } = await supabaseAdmin
    .from('members')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();

  if (!member) return { error: 'Member not found.' };

  // Create bucket if it doesn't exist yet
  await supabaseAdmin.storage.createBucket('member-photos', { public: true }).catch(() => {});

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${member.id}/avatar.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from('member-photos')
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) return { error: 'Upload failed. Try again.' };

  const { data: { publicUrl } } = supabaseAdmin.storage.from('member-photos').getPublicUrl(path);

  await supabaseAdmin.from('members').update({ photo_url: publicUrl }).eq('id', member.id);

  revalidatePath('/me');
  revalidatePath('/members');
  return { success: true, url: publicUrl };
}
