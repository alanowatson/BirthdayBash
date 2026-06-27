import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Member, Travel } from '@/lib/types';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TravelForm from '../../travel/TravelForm';

export const revalidate = 0;

function vegasTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string }>;
}

export default async function MemberPage({ params, searchParams }: Props) {
  const [{ slug }, { sent }] = await Promise.all([params, searchParams]);

  let user = null;
  try {
    const authClient = await createAuthClient();
    const res = await authClient.auth.getUser();
    user = res.data.user ?? null;
  } catch { /* no cookie context */ }

  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) notFound();
  const member = data as Member;

  const [viewerRes, travelRes] = await Promise.all([
    user?.email
      ? supabaseAdmin.from('members').select('is_admin, id, email').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
    supabaseAdmin.from('travel').select('*').eq('member_id', member.id).maybeSingle(),
  ]);

  const viewer = viewerRes.data;
  const isAdmin = viewer?.is_admin === true;
  const isSelf = viewer?.email === member.email;
  const travel = (travelRes.data as Travel | null) ?? null;

  const isFlying = travel?.travel_mode === 'flying';

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">

          {sent && (
            <div
              className="mb-8 px-5 py-4 rounded-xl border text-sm text-left"
              style={{ borderColor: 'var(--blue)', background: 'rgba(59,130,246,0.08)' }}
            >
              <p className="text-blue-bright font-medium mb-1">Check your email</p>
              <p className="text-text-dim">
                We sent a magic link to <span className="text-text">{member.email}</span>. Click it
                to access your profile and manage RSVPs.
              </p>
            </div>
          )}

          <div
            className="avatar mx-auto mb-6"
            style={{ width: 96, height: 96, fontSize: '2rem', background: 'linear-gradient(135deg, #D4AF37, #3B82F6)' }}
          >
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              member.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
            )}
          </div>

          <h1 className="font-display text-5xl gold-gradient mb-2">{member.name}</h1>
          {member.is_referee && <p className="text-sky text-sm mb-6 uppercase tracking-widest">Referee</p>}

          {/* Bio cards */}
          {(member.bio || member.known_for || member.fun_fact || member.obsession) && (
            <div className="mb-6 flex flex-col gap-3 text-left">
              {member.bio && (
                <div className="rounded-xl px-6 py-4" style={{ border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.05)' }}>
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">How do you know Alan</p>
                  <p className="text-text text-sm leading-relaxed">{member.bio}</p>
                </div>
              )}
              {member.obsession && (
                <div className="rounded-xl px-6 py-4" style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.05)' }}>
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Will talk your ear off about</p>
                  <p className="text-text text-sm leading-relaxed">{member.obsession}</p>
                </div>
              )}
              {member.known_for && (
                <div className="rounded-xl px-6 py-4" style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)' }}>
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Known for</p>
                  <p className="text-text text-sm leading-relaxed">{member.known_for}</p>
                </div>
              )}
              {member.fun_fact && (
                <div className="rounded-xl px-6 py-4" style={{ border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.05)' }}>
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Fun fact</p>
                  <p className="text-text text-sm leading-relaxed">{member.fun_fact}</p>
                </div>
              )}
            </div>
          )}

          {/* Travel info — shown to everyone if the member has shared plans */}
          {travel && (
            <div
              className="mb-6 rounded-xl px-6 py-4 text-left"
              style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}
            >
              <p className="text-xs uppercase tracking-widest text-text-dim mb-3">
                {isFlying ? '✈️ Flying in' : '🚗 Driving in'}
              </p>
              <div className="flex flex-col gap-2 text-sm">
                {travel.arrives_at && (
                  <div>
                    <span className="text-text-dim text-xs uppercase tracking-widest">Arriving</span>
                    <p style={{ color: 'var(--text)' }}>{vegasTime(travel.arrives_at)}</p>
                    {isFlying && travel.arrival_airline && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        {travel.arrival_airline}{travel.arrival_flight ? ` · ${travel.arrival_flight}` : ''}
                      </p>
                    )}
                  </div>
                )}
                {travel.departs_at && (
                  <div className={travel.arrives_at ? 'mt-1' : ''}>
                    <span className="text-text-dim text-xs uppercase tracking-widest">Departing</span>
                    <p style={{ color: 'var(--text)' }}>{vegasTime(travel.departs_at)}</p>
                    {isFlying && travel.departure_airline && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        {travel.departure_airline}{travel.departure_flight ? ` · ${travel.departure_flight}` : ''}
                      </p>
                    )}
                  </div>
                )}
                {travel.accommodation && (
                  <div className="mt-1">
                    <span className="text-text-dim text-xs uppercase tracking-widest">Staying at</span>
                    <p style={{ color: 'var(--text)' }}>{travel.accommodation}</p>
                  </div>
                )}
                {travel.notes && (
                  <p className="text-xs italic mt-1" style={{ color: 'var(--text-dim)' }}>&ldquo;{travel.notes}&rdquo;</p>
                )}
              </div>
            </div>
          )}

          {/* Travel edit form — only for the profile owner */}
          {isSelf && (
            <div className="mb-6 text-left">
              <p className="font-display text-xl text-gold mb-1">
                {travel ? 'Update your travel plans' : 'Add your travel plans'}
              </p>
              <p className="text-text-dim text-xs mb-4">All times are Las Vegas time (PDT).</p>
              <TravelForm
                myMemberId={member.id}
                myTravel={travel}
                isAdmin={false}
                members={[]}
                allTravel={travel ? [travel] : []}
              />
            </div>
          )}

          {isAdmin && (
            <div className="mt-6">
              <a
                href={`/admin/members/${member.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-colors"
                style={{ border: '1px solid var(--gold-soft)', color: 'var(--gold)', background: 'rgba(212,175,55,0.06)' }}
              >
                ✎ Edit profile
              </a>
            </div>
          )}

          <div className="mt-6 flex gap-4 justify-center">
            <a href="/" className="text-text-dim text-sm hover:text-gold transition-colors">← Back to home</a>
            <span className="text-text-dim text-sm">·</span>
            <a href="/members" className="text-text-dim text-sm hover:text-gold transition-colors">See all guests</a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
