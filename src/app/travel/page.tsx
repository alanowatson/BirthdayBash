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

function TravelTable({ entries }: { entries: TravelWithMember[] }) {
  if (entries.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-dim text-sm">No travel plans shared yet — be the first.</p>
      </div>
    );
  }

  const thStyle = {
    color: 'var(--text-dim)',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
  };
  const tdStyle = {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs uppercase tracking-widest pb-3 pr-4 font-normal" style={thStyle}>Guest</th>
            <th className="text-left text-xs uppercase tracking-widest pb-3 pr-4 font-normal" style={thStyle}>Arriving</th>
            <th className="text-left text-xs uppercase tracking-widest pb-3 pr-4 font-normal" style={thStyle}>Departing</th>
            <th className="text-left text-xs uppercase tracking-widest pb-3 font-normal" style={thStyle}>Staying</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const name = entry.members?.name ?? 'Unknown';
            const photo = entry.members?.photo_url;
            const isFlying = entry.travel_mode === 'flying';

            return (
              <tr key={entry.id}>
                {/* Guest */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  <div className="flex items-center gap-2">
                    {photo ? (
                      <img src={photo} alt={name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-display"
                        style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
                      >
                        {name[0]}
                      </div>
                    )}
                    <div className="whitespace-nowrap">
                      <span style={{ color: 'var(--text)' }}>{name}</span>
                      <span className="ml-1.5 text-xs">{isFlying ? '✈️' : '🚗'}</span>
                    </div>
                  </div>
                </td>

                {/* Arriving */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  {entry.arrives_at ? (
                    <div>
                      <p style={{ color: 'var(--text)' }} className="whitespace-nowrap">{vegasTime(entry.arrives_at)}</p>
                      {isFlying && entry.arrival_airline && (
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                          {entry.arrival_airline}{entry.arrival_flight ? ` ${entry.arrival_flight}` : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>

                {/* Departing */}
                <td className="py-3 pr-4 align-top" style={tdStyle}>
                  {entry.departs_at ? (
                    <div>
                      <p style={{ color: 'var(--text)' }} className="whitespace-nowrap">{vegasTime(entry.departs_at)}</p>
                      {isFlying && entry.departure_airline && (
                        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                          {entry.departure_airline}{entry.departure_flight ? ` ${entry.departure_flight}` : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>

                {/* Staying */}
                <td className="py-3 align-top" style={tdStyle}>
                  {entry.accommodation ? (
                    <span style={{ color: 'var(--text)' }}>{entry.accommodation}</span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                  {entry.notes && (
                    <p className="text-xs italic mt-0.5" style={{ color: 'var(--text-dim)' }}>&ldquo;{entry.notes}&rdquo;</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
