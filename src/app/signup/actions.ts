'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 0;
  while (true) {
    const { data } = await supabaseAdmin.from('members').select('id').eq('slug', slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${++n}`;
  }
}

// Signs the user in entirely server-side:
// 1. generateLink gives us a hashed_token without sending any email
// 2. verifyOtp redeems it and writes the session cookies directly into the response
//    (works because createAuthClient's setAll handler writes to next/headers cookies)
async function signInServerSide(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });
    if (error || !data?.properties?.hashed_token) return false;

    const supabase = await createAuthClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: data.properties.hashed_token,
      type: 'magiclink',
    });
    return !verifyError;
  } catch {
    return false;
  }
}

export type RsvpState = { error: string } | null;

export async function submitRsvpAction(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const name = (formData.get('name') as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim().toLowerCase() ?? '';
  const attending = formData.get('attending') as string;

  if (!name || !email) return { error: 'Name and email are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  const { data: existing } = await supabaseAdmin
    .from('members')
    .select('slug')
    .eq('email', email)
    .maybeSingle();

  if (attending !== 'yes') {
    if (existing) {
      await supabaseAdmin.from('members').update({ name, trip_rsvp: 'no' }).eq('email', email);
    } else {
      const slug = await uniqueSlug(toSlug(name));
      await supabaseAdmin.from('members').insert({ name, email, slug, trip_rsvp: 'no' });
    }
    redirect('/signup/declined');
  }

  // Attending yes — upsert member
  let memberSlug: string;
  if (existing) {
    memberSlug = existing.slug;
    await supabaseAdmin.from('members').update({ name, trip_rsvp: 'yes' }).eq('email', email);
  } else {
    memberSlug = await uniqueSlug(toSlug(name));
    const { error } = await supabaseAdmin
      .from('members')
      .insert({ name, email, slug: memberSlug, trip_rsvp: 'yes' });
    if (error) return { error: 'Something went wrong. Please try again.' };
  }

  // Create Supabase auth user (pre-confirmed, no email sent).
  // Ignore error — user may already exist in auth if they're re-RSVPing.
  await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });

  // Sign in server-side: generateLink → verifyOtp writes session cookies.
  // Then redirect() to an internal route — no cross-origin bounce needed.
  const ok = await signInServerSide(email);
  if (ok) redirect('/signup/profile');

  // Fallback: email magic link (rare — only if generateLink/verifyOtp fail)
  const supabase = await createAuthClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/signup/profile`,
      shouldCreateUser: false,
    },
  });
  return {
    error: `Almost there! Check your email (${email}) for a sign-in link to continue setup.`,
  };
}
