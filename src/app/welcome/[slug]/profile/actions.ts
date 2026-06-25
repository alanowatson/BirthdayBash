'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';

export type PhotoState = { success: true; url: string } | { error: string } | null;

function vegasToUTC(local: string | null): string | null {
  if (!local) return null;
  return new Date(local + ':00-07:00').toISOString();
}

export async function uploadPhotoBySlugAction(
  _prev: PhotoState,
  formData: FormData
): Promise<PhotoState> {
  const slug = formData.get('slug') as string;
  const file = formData.get('photo') as File | null;

  if (!file || file.size === 0) return { error: 'No file selected.' };
  if (file.size > 5 * 1024 * 1024) return { error: 'File must be under 5MB.' };
  if (!file.type.startsWith('image/')) return { error: 'Must be an image file.' };

  const { data: member } = await supabaseAdmin
    .from('members').select('id').eq('slug', slug).maybeSingle();
  if (!member) return { error: 'Member not found.' };

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
  revalidatePath(`/members/${slug}`);

  return { success: true, url: publicUrl };
}

export async function submitProfileAction(formData: FormData) {
  const slug = formData.get('slug') as string;

  const { data: member } = await supabaseAdmin
    .from('members').select('id').eq('slug', slug).maybeSingle();
  if (!member) redirect(`/members/${slug}`);

  // Profile fields
  const obsession  = (formData.get('obsession') as string)?.trim() || null;
  const fun_fact   = (formData.get('fun_fact')  as string)?.trim() || null;
  const tshirt_size = (formData.get('tshirt_size') as string)?.trim() || null;

  await supabaseAdmin
    .from('members')
    .update({ obsession, fun_fact, tshirt_size })
    .eq('id', member.id);

  // Travel — only upsert if the user filled in at least one time field
  const arrivesRaw = formData.get('arrives_at') as string || null;
  const departsRaw = formData.get('departs_at') as string || null;

  if (arrivesRaw || departsRaw) {
    const mode = (formData.get('travel_mode') as string) || 'flying';
    const isFlying = mode === 'flying';

    await supabaseAdmin.from('travel').upsert({
      member_id:         member.id,
      travel_mode:       mode,
      arrives_at:        vegasToUTC(arrivesRaw),
      arrival_airline:   isFlying ? (formData.get('arrival_airline')   as string || null) : null,
      arrival_flight:    isFlying ? (formData.get('arrival_flight')    as string || null) : null,
      departs_at:        vegasToUTC(departsRaw),
      departure_airline: isFlying ? (formData.get('departure_airline') as string || null) : null,
      departure_flight:  isFlying ? (formData.get('departure_flight')  as string || null) : null,
      accommodation:     formData.get('accommodation') as string || null,
      notes:             formData.get('notes')         as string || null,
      updated_at:        new Date().toISOString(),
    }, { onConflict: 'member_id' });
  }

  revalidatePath(`/members/${slug}`);
  redirect(`/members/${slug}`);
}
