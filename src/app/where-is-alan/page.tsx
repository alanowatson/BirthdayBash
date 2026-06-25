import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import AlanMap from './AlanMap';

export const dynamic = 'force-dynamic';

export default async function WhereIsAlanPage() {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  // Fetch location only for signed-in users
  const initial = user
    ? await supabaseAdmin
        .from('location')
        .select('lat, lon, updated_at')
        .eq('id', 1)
        .maybeSingle()
        .then(({ data }) => data ?? { lat: 0, lon: 0, updated_at: new Date().toISOString() })
    : null;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Header */}
      <section
        className="pt-24 pb-8 px-6 border-b"
        style={{ borderColor: 'var(--gold-soft)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-text-dim mb-2">Live Tracking</p>
          <h1 className="font-display text-4xl md:text-5xl gold-gradient mb-3">Where is Alan?</h1>
          <p className="text-text-dim text-sm max-w-xl">
            In an effort to facilitate the inevitable question of &ldquo;where is everyone?&rdquo; Alan built a tracker
            he can turn on before events — and most importantly, help people find him easily during the Fremont Street night.
            The map updates automatically, no refresh needed.
          </p>
        </div>
      </section>

      {/* Map or sign-in prompt */}
      <section className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto" style={{ height: 'calc(100vh - 320px)', minHeight: 460 }}>
          {initial ? (
            <div
              className="w-full h-full rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <AlanMap initial={initial} />
            </div>
          ) : (
            <div
              className="w-full h-full rounded-xl flex items-center justify-center"
              style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)' }}
            >
              <div className="text-center px-6">
                <p className="font-display text-2xl text-gold mb-2">You&apos;re on the guest list, right?</p>
                <p className="text-text-dim text-sm mb-6 max-w-xs mx-auto">
                  Sign in with your invite to track Alan&apos;s location during the weekend.
                </p>
                <a
                  href="/welcome"
                  className="rsvp-chip px-6 py-3 rounded-full text-sm uppercase tracking-widest"
                >
                  Sign in
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
