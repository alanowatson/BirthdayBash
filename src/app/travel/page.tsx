import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Travel, Member } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TravelForm from './TravelForm';
import TravelTable from './TravelTable';

export const revalidate = 0;
export const metadata = { title: "Travel · Alan's 40th" };

type TravelWithMember = Travel & {
  members: { name: string; photo_url: string | null; slug: string } | null;
};

export default async function TravelPage() {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  const [travelRes, memberRes] = await Promise.all([
    supabaseAdmin
      .from('travel')
      .select('*, members(name, photo_url, slug)')
      .order('arrives_at', { ascending: true, nullsFirst: false }),
    user?.email
      ? supabaseAdmin.from('members').select('id, name, is_admin').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const allTravel = (travelRes.data ?? []) as TravelWithMember[];
  const me = memberRes.data;
  const isAdmin = me?.is_admin === true;

  const myTravel = me ? allTravel.find((t) => t.member_id === me.id) ?? null : null;

  const adminMembers = isAdmin
    ? await supabaseAdmin.from('members').select('id, name').order('name').then(({ data }) => data ?? [])
    : [];

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <section className="pt-32 pb-8 px-6 text-center">
        <p className="section-label section-label-blue mb-4">Logistics</p>
        <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-4">Getting There</h1>
        <p className="text-text-dim max-w-xl mx-auto">
          Share your travel plans so the crew can coordinate — same flights, shared cabs, airport runs.
          All times are Las Vegas time (PDT).
        </p>
      </section>

      <section className="flex-1 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: table */}
            <div className="flex-1 min-w-0">
              <TravelTable entries={allTravel} />
            </div>

            {/* Right: form */}
            <div className="w-full lg:w-80 xl:w-88 flex-shrink-0 lg:sticky lg:top-24">
              {me ? (
                <TravelForm
                  myMemberId={me.id}
                  myTravel={myTravel as Travel | null}
                  isAdmin={isAdmin}
                  members={adminMembers as Pick<Member, 'id' | 'name'>[]}
                  allTravel={allTravel as Travel[]}
                  compact
                />
              ) : (
                <div
                  className="rounded-xl px-5 py-4 text-sm"
                  style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)', color: 'var(--text-dim)' }}
                >
                  <a href="/welcome" className="text-gold underline underline-offset-2">Sign in</a>
                  {' '}to add your travel plans.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
