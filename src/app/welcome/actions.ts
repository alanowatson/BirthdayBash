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

// Generates a one-time sign-in URL via the admin API and returns the Supabase
// verify URL so the browser can exchange it for a real session immediately —
// no email click required.
async function buildSignInUrl(email: string, next: string): Promise<string | null> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) return null;
    return data?.properties?.action_link ?? null;
  } catch {
    return null;
  }
}

export type WelcomeStep1State = { error: string } | { sent: string } | null;

export async function welcomeStep1Action(
  _prev: WelcomeStep1State,
  formData: FormData
): Promise<WelcomeStep1State> {
  const name  = (formData.get('name')  as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim().toLowerCase() ?? '';
  const bio   = (formData.get('bio')   as string)?.trim() || null;

  if (!name || !email) return { error: 'Name and email are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };

  // Returning guest — auto-sign-in and drop them on their welcome page
  const { data: existing } = await supabaseAdmin
    .from('members').select('slug').eq('email', email).maybeSingle();
  if (existing) {
    const url = await buildSignInUrl(email, `/welcome/${existing.slug}`);
    if (url) redirect(url);
    // Fallback: auto-sign-in failed (e.g. recently-deleted auth user);
    // send a magic link email so they can sign in the old-fashioned way.
    const supabase = await createAuthClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(`/welcome/${existing.slug}`)}`,
        shouldCreateUser: true,
      },
    });
    return { sent: email };
  }

  // New guest — create member then auto-sign-in through the same redirect dance
  const slug = await uniqueSlug(toSlug(name));
  const { error } = await supabaseAdmin.from('members').insert({ name, email, slug, bio });
  if (error) return { error: 'Something went wrong — please try again.' };

  const url = await buildSignInUrl(email, `/welcome/${slug}`);
  redirect(url ?? `/welcome/${slug}`);
}
