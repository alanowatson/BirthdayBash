'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

export type AdminPhotoState = { success: true; url: string } | { error: string } | null;

async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');
  const { data: member } = await supabaseAdmin
    .from('members').select('is_admin').eq('email', user.email).maybeSingle();
  if (!member?.is_admin) throw new Error('Not authorized');
}

export async function updateMemberAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const name = ((formData.get('name') as string) ?? '').trim();
  const bio = ((formData.get('bio') as string) ?? '').trim() || null;
  const slug = ((formData.get('slug') as string) ?? '').trim();
  const obsession = ((formData.get('obsession') as string) ?? '').trim() || null;
  const tshirt_size = ((formData.get('tshirt_size') as string) ?? '').trim() || null;
  const known_for = ((formData.get('known_for') as string) ?? '').trim() || null;
  const fun_fact = ((formData.get('fun_fact') as string) ?? '').trim() || null;

  if (!name || !slug) return;

  await supabaseAdmin.from('members').update({ name, bio, slug, obsession, tshirt_size, known_for, fun_fact }).eq('id', id);

  revalidatePath('/admin/members');
  revalidatePath(`/admin/members/${id}`);
  revalidatePath('/members');
}

export async function adminUploadPhotoAction(_prev: AdminPhotoState, formData: FormData): Promise<AdminPhotoState> {
  try {
    await requireAdmin();

    const memberId = formData.get('member_id') as string | null;
    const file = formData.get('photo') as File | null;

    if (!memberId) return { error: 'Member ID missing.' };
    if (!file || file.size === 0) return { error: 'No file selected.' };
    if (file.size > 5 * 1024 * 1024) return { error: 'File must be under 5MB.' };
    if (!file.type.startsWith('image/')) return { error: 'Must be an image file.' };

    await supabaseAdmin.storage.createBucket('member-photos', { public: true }).catch(() => {});

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${memberId}/avatar.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from('member-photos')
      .upload(path, bytes, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('adminUploadPhotoAction upload error:', uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from('member-photos').getPublicUrl(path);
    // Append a timestamp so the browser doesn't serve a stale cached version after re-upload
    const urlWithBust = `${publicUrl}?t=${Date.now()}`;

    await supabaseAdmin.from('members').update({ photo_url: urlWithBust }).eq('id', memberId);

    revalidatePath(`/admin/members/${memberId}`);

    return { success: true, url: urlWithBust };
  } catch (err) {
    console.error('adminUploadPhotoAction unexpected error:', err);
    return { error: err instanceof Error ? err.message : 'Unexpected error. Check server logs.' };
  }
}

export type RsvpSaveState = { success: true } | { error: string } | null;

export async function bulkUpdateRsvpsAction(_prev: RsvpSaveState, formData: FormData): Promise<RsvpSaveState> {
  try {
    await requireAdmin();

    const member_id = formData.get('member_id') as string;
    const event_ids = formData.getAll('event_ids') as string[];

    for (const event_id of event_ids) {
      const raw = formData.get(`rsvp_${event_id}`);
      const status = typeof raw === 'string' ? raw : 'none';

      if (status === 'none') {
        await supabaseAdmin.from('rsvps').delete()
          .eq('member_id', member_id).eq('event_id', event_id);
      } else {
        await supabaseAdmin.from('rsvps').upsert(
          { member_id, event_id, status },
          { onConflict: 'member_id,event_id' }
        );
      }
    }

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('bulkUpdateRsvpsAction error:', err);
    return { error: 'Failed to save RSVPs.' };
  }
}
