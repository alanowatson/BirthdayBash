'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error('Not authenticated');
  const { data: member } = await supabaseAdmin
    .from('members').select('is_admin').eq('email', user.email).maybeSingle();
  if (!member?.is_admin) throw new Error('Not authorized');
}

function toUtcIso(datetimeLocal: string | null): string | null {
  if (!datetimeLocal) return null;
  return new Date(datetimeLocal + 'Z').toISOString();
}

export async function updateEventAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const title = ((formData.get('title') as string) ?? '').trim();
  const slug = ((formData.get('slug') as string) ?? '').trim();
  const description = ((formData.get('description') as string) ?? '').trim() || null;
  const starts_at = toUtcIso(formData.get('starts_at') as string);
  const ends_at = toUtcIso((formData.get('ends_at') as string) || null);
  const location = ((formData.get('location') as string) ?? '').trim() || null;
  const is_featured = formData.get('is_featured') === 'on';
  const display_order = parseInt((formData.get('display_order') as string) ?? '0') || 0;

  const pricing_raw = ((formData.get('pricing_tiers') as string) ?? '').trim();
  let pricing_tiers = null;
  if (pricing_raw) {
    try { pricing_tiers = JSON.parse(pricing_raw); } catch { /* invalid JSON, leave null */ }
  }

  if (!title || !slug || !starts_at) return;

  await supabaseAdmin.from('events').update({
    title, slug, description, starts_at, ends_at, location,
    pricing_tiers, is_featured, display_order,
  }).eq('id', id);

  revalidatePath('/admin/events');
  revalidatePath('/');
  revalidatePath(`/events/${slug}`);
}
