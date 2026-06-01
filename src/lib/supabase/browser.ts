'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — uses @supabase/ssr so it reads the same cookie-based
// session that the server-side auth client writes.
export const supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey);
