import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import AlanMap from './AlanMap';

export const dynamic = 'force-dynamic';

export default async function WhereIsAlanPage() {
  // Guests only — redirect anyone not signed in
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect('/welcome');

  // Fetch Alan's current location (single row, id = 1)
  const { data } = await supabaseAdmin
    .from('location')
    .select('lat, lon, updated_at')
    .eq('id', 1)
    .maybeSingle();

  const initial = data ?? { lat: 0, lon: 0, updated_at: new Date().toISOString() };

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Header */}
      <section
        className="pt-24 pb-8 px-6 border-b"
        style={{ borderColor: 'var(--gold-soft)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-text-dim mb-2">Live · Fremont Street Crawl</p>
          <h1 className="font-display text-4xl md:text-5xl gold-gradient mb-2">Where is Alan?</h1>
          <p className="text-text-dim text-sm max-w-xl">
            Alan&apos;s real-time location during the Friday night bar crawl. The map updates automatically — no refresh needed.
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto" style={{ height: 'calc(100vh - 320px)', minHeight: 460 }}>
          <div
            className="w-full h-full rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <AlanMap initial={initial} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
