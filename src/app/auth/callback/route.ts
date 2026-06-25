import { createAuthClient } from '@/lib/supabase/server-session';
import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code       = url.searchParams.get('code');
  const token_hash = url.searchParams.get('token_hash');
  const type       = url.searchParams.get('type') as EmailOtpType | null;
  const next       = url.searchParams.get('next') ?? '/me';

  const supabase = await createAuthClient();

  if (code) {
    // PKCE flow (OAuth, some magic-link configs)
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // OTP / magic-link email flow
    await supabase.auth.verifyOtp({ token_hash, type });
  }

  return NextResponse.redirect(new URL(next, request.url));
}
