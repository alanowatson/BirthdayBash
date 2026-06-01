'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 0;
  while (true) {
    const { data } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) return slug;
    n++;
    slug = `${base}-${n}`;
  }
}

async function sendMagicLink(email: string) {
  const supabase = await createAuthClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  });
}

export async function signupAction(_prev: unknown, formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';
  const bio = (formData.get('bio') as string | null)?.trim() || null;
  const obsession = (formData.get('obsession') as string | null)?.trim() || null;
  const tripRsvpRaw = formData.get('trip_rsvp') as string | null;
  const trip_rsvp = tripRsvpRaw === 'yes' || tripRsvpRaw === 'no' ? tripRsvpRaw : null;

  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  const { data: existing } = await supabaseAdmin
    .from('members')
    .select('slug')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    await sendMagicLink(email);
    redirect(`/members/${existing.slug}?sent=1`);
  }

  const slug = await uniqueSlug(toSlug(name));

  const { error } = await supabaseAdmin.from('members').insert({
    name,
    email,
    slug,
    bio,
    obsession,
    trip_rsvp,
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  await sendMagicLink(email);
  redirect(`/members/${slug}?sent=1`);
}
