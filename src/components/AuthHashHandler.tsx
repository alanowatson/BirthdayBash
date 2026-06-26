'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

// Supabase falls back to the implicit flow (tokens in the URL hash) when the
// redirectTo URL isn't in the project's whitelist. This component detects
// that case, exchanges the tokens for a proper cookie-based session, and
// navigates the user to /me.
export default function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('access_token=')) return;

    const params = new URLSearchParams(hash.substring(1));
    const access_token  = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return;

    supabaseBrowser.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (!error) {
          // Clear the hash so the tokens don't linger in the URL
          window.history.replaceState(null, '', window.location.pathname);
          router.replace('/me');
        }
      });
  }, [router]);

  return null;
}
