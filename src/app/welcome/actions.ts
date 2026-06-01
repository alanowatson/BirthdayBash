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

async function sendMagicLink(email: string) {
  const supabase = await createAuthClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/me`,
      shouldCreateUser: true,
    },
  });
}

export type WelcomeStep1State = { error: string } | null;

export async function welcomeStep1Action(
  _prev: WelcomeStep1State,
  formData: FormData
): Promise<WelcomeStep1State> {
  const name = (formData.get('name') as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim().toLowerCase() ?? '';
  const bio = (formData.get('bio') as string)?.trim() || null;

  if (!name || !email) return { error: 'Name and email are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };

  // Returning guest — send a fresh magic link and skip to their step 2
  const { data: existing } = await supabaseAdmin
    .from('members').select('slug').eq('email', email).maybeSingle();
  if (existing) {
    await sendMagicLink(email);
    redirect(`/welcome/${existing.slug}`);
  }

  const slug = await uniqueSlug(toSlug(name));
  const { error } = await supabaseAdmin.from('members').insert({ name, email, slug, bio });
  if (error) return { error: 'Something went wrong — please try again.' };

  await sendMagicLink(email);
  redirect(`/welcome/${slug}`);
}
