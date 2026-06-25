import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Travel, Member } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TravelForm from './TravelForm';

export const revalidate = 0;
export const metadata = { title: "Travel · Alan's 40th" };

function vegasTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type TravelWithMember = Travel & {
  members: { name: string; photo_url: string | null; slug: string } | null;
};

function TravelCard({ entry }: { entry: TravelWithMember }) {
  const isFlying = entry.travel_mode === 'flying';
  const name = entry.members?.name ?? 'Unknown';
  const photo = entry.members?.photo_url;

  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-col gap-3"
      style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Name + mode */}
      <div className="flex items-center gap-3">
        {photo ? (
          <img src={photo} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-sm"
            style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
          >
            {name[0]}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-base" style={{ color: 'var(--text)' }}>{name}</span>
          <span className="text-sm">{isFlying ? '✈️' : '🚗'}</span>
        </div>
      </div>

      {/* Arrival */}
      {entry.arrives_at && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-xs uppercase tracking-widest w-20 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
            Arriving
          </span>
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {vegasTime(entry.arrives_at)}
            {isFlying && entry.arrival_airline && (
              <span className="text-text-dim">
                {' · '}{entry.arrival_airline}
                {entry.arrival_flight && <> {entry.arrival_flight}</>}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Departure */}
      {entry.departs_at && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-xs uppercase tracking-widest w-20 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
            Departing
          </span>
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {vegasTime(entry.departs_at)}
            {isFlying && entry.departure_airline && (
              <span className="text-text-dim">
                {' · '}{entry.departure_airline}
                {entry.departure_flight && <> {entry.departure_flight}</>}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Accommodation */}
      {entry.accommodation && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-xs uppercase tracking-widest w-20 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
            Staying
          </span>
          <span className="text-sm" style={{ color: 'var(--text)' }}>{entry.accommodation}</span>
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>&ldquo;{entry.notes}&rdquo;</p>
      )}
    </div>
  );
}

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

  // For admin member picker — all members
  const adminMembers = isAdmin
    ? await supabaseAdmin.from('members').select('id, name').order('name').then(({ data }) => data ?? [])
    : [];

  // Split into flying / driving, sorted by arrival time
  const flying  = allTravel.filter((t) => t.travel_mode === 'flying');
  const driving = allTravel.filter((t) => t.travel_mode === 'driving');

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 text-center">
        <p className="section-label section-label-blue mb-4">Logistics</p>
        <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-4">Getting There</h1>
        <p className="text-text-dim text-lg max-w-xl mx-auto">
          Share your travel plans so the crew can coordinate — same flights, shared cabs, airport
          runs. All times are Las Vegas time (PDT).
        </p>
      </section>

      <section className="flex-1 px-6 pb-16">
        <div className="max-w-3xl mx-auto">

          {/* Form — signed-in only */}
          {me ? (
            <TravelForm
              myMemberId={me.id}
              myTravel={myTravel as Travel | null}
              isAdmin={isAdmin}
              members={adminMembers as Pick<Member, 'id' | 'name'>[]}
              allTravel={allTravel as Travel[]}
            />
          ) : (
            <div
              className="rounded-xl px-6 py-5 mb-8 text-sm"
              style={{ border: '1px solid rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.03)', color: 'var(--text-dim)' }}
            >
              <a href="/welcome" className="text-gold underline underline-offset-2">Sign in</a>
              {' '}to add your travel plans.
            </div>
          )}

          {/* Travel list */}
          {allTravel.length === 0 ? (
            <p className="text-text-dim text-sm text-center py-12">
              No travel plans shared yet — be the first.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {flying.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
                    ✈️ Flying ({flying.length})
                  </p>
                  <div className="flex flex-col gap-3">
                    {flying.map((t) => <TravelCard key={t.id} entry={t} />)}
                  </div>
                </div>
              )}
              {driving.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
                    🚗 Driving ({driving.length})
                  </p>
                  <div className="flex flex-col gap-3">
                    {driving.map((t) => <TravelCard key={t.id} entry={t} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
