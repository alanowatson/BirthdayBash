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

export async function upsertLinkAction(formData: FormData) {
  await requireAdmin();

  const id = (formData.get('id') as string | null) || null;
  const title = ((formData.get('title') as string) ?? '').trim();
  const description = ((formData.get('description') as string) ?? '').trim() || null;
  const url = ((formData.get('url') as string) ?? '').trim() || null;
  const icon = (formData.get('icon') as string) || 'link';
  const display_order = parseInt((formData.get('display_order') as string) ?? '0') || 0;
  const is_visible = formData.get('is_visible') === 'on';

  if (!title) return;

  if (id) {
    await supabaseAdmin
      .from('site_links')
      .update({ title, description, url, icon, display_order, is_visible })
      .eq('id', id);
  } else {
    await supabaseAdmin
      .from('site_links')
      .insert({ title, description, url, icon, display_order, is_visible });
  }

  revalidatePath('/admin/links');
  revalidatePath('/');
}

export async function deleteLinkAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await supabaseAdmin.from('site_links').delete().eq('id', id);
  revalidatePath('/admin/links');
  revalidatePath('/');
}
