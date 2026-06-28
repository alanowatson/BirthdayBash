import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Member, Travel } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TravelTable from '../travel/TravelTable';
import TravelForm from '../travel/TravelForm';

export const revalidate = 0;

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #D4AF37, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #D4AF37)',
  'linear-gradient(135deg, #38BDF8, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #38BDF8)',
  'linear-gradient(135deg, #D4AF37, #38BDF8)',
];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

type TravelWithMember = Travel & {
  members: { name: string; photo_url: string | null; slug: string } | null;
};

// Safely resolves the current auth user.
// Returns null when called without a request cookie context (e.g. background revalidation).
async function getAuthUser() {
  try {
    const authClient = await createAuthClient();
    const { data: { user } } = await authClient.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export default async function MembersPage() {
  const user = await getAuthUser();

  const [membersRes, travelRes, memberRes] = await Promise.all([
    supabaseAdmin
      .from('members')
      .select('*')
      .or('trip_rsvp.is.null,trip_rsvp.eq.yes')
      .order('created_at', { ascending: true }),
    supabaseAdmin
      .from('travel')
      .select('*, members(name, photo_url, slug)')
      .order('arrives_at', { ascending: true, nullsFirst: false }),
    user?.email
      ? supabaseAdmin.from('members').select('id, name, is_admin').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const members = (membersRes.data ?? []) as Member[];
  const allTravel = ((travelRes.data ?? []) as TravelWithMember[]).filter(
    (t) => t.arrives_at || t.departs_at || t.accommodation
  );
  const me = memberRes.data;
  const isAdmin = me?.is_admin === true;

  const myTravel = me ? allTravel.find((t) => t.member_id === me.id) ?? null : null;

  const adminMembers = isAdmin
    ? await supabaseAdmin.from('members').select('id, name').order('name').then(({ data }) => data ?? [])
    : [];

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 px-6 py-24">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <p className="section-label mb-4">The Guest List</p>
            <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-3">Who&#39;s Coming</h1>
            <p className="text-text-dim max-w-md mx-auto">
              {members.length > 0
                ? `${members.length} ${members.length === 1 ? 'person' : 'people'} in so far.`
                : 'No one yet. Be the first.'}
            </p>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12">
              <a href="/signup" className="rsvp-chip px-8 py-4 rounded-full uppercase text-sm tracking-widest inline-block">
                Get on the list
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {members.map((member, i) => (
                <a
                  key={member.id}
                  href={`/members/${member.slug}`}
                  className="event-card border border-gold-soft rounded-lg p-5 text-center block"
                >
                  <div
                    className="avatar mx-auto mb-3"
                    style={{
                      width: 64, height: 64, fontSize: '1.25rem',
                      background: member.photo_url ? undefined : AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                    }}
                  >
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      initials(member.name)
                    )}
                  </div>
                  <p className="font-display text-lg text-gold">{member.name}</p>
                  {member.bio && <p className="text-xs text-text-dim line-clamp-1">{member.bio}</p>}
                  {member.is_referee && <p className="text-xs text-sky mt-1">Referee</p>}
                </a>
              ))}
            </div>
          )}

          {/* Travel — only shown to signed-in members */}
          {me && (
            <div
              id="travel"
              className="mt-16 pt-12 border-t"
              style={{ borderColor: 'var(--gold-soft)' }}
            >
              <div className="mb-8">
                <p className="font-display text-2xl text-gold mb-2">How are they getting there?</p>
                <p className="text-text-dim text-sm max-w-md">
                  See and share travel plans — same flights, shared cabs, airport runs.
                  All times are Las Vegas time (PDT).
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0">
                  <TravelTable entries={allTravel} />
                </div>
                <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                  <TravelForm
                    myMemberId={me.id}
                    myTravel={myTravel as Travel | null}
                    isAdmin={isAdmin}
                    members={adminMembers as Pick<Member, 'id' | 'name'>[]}
                    allTravel={allTravel as Travel[]}
                    compact
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
