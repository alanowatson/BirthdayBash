import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Member } from '@/lib/types';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string }>;
}

export default async function MemberPage({ params, searchParams }: Props) {
  const [{ slug }, { sent }] = await Promise.all([params, searchParams]);

  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) notFound();

  const member = data as Member;

  // Check if the current viewer is an admin
  const viewerRes = user?.email
    ? await supabaseAdmin.from('members').select('is_admin, id').eq('email', user.email).maybeSingle()
    : { data: null };
  const isAdmin = viewerRes.data?.is_admin === true;

  // "Coming" means they've confirmed for the trip overall (trip_rsvp), not
  // that they've filled out individual event RSVPs yet — those can lag behind.
  const isComing = member.trip_rsvp === 'yes';

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
          {member.bio && <p className="text-text-dim mb-6">{member.bio}</p>}
          {member.is_referee && <p className="text-sky text-sm mb-6 uppercase tracking-widest">Referee</p>}

          {/* Profile info — shown for guests confirmed for the trip */}
          {isComing && (member.known_for || member.fun_fact || member.obsession) && (
            <div className="mb-6 flex flex-col gap-3 text-left">
              {member.obsession && (
                <div
                  className="rounded-xl px-6 py-4"
                  style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.05)' }}
                >
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Will talk your ear off about</p>
                  <p className="text-text text-sm leading-relaxed">{member.obsession}</p>
                </div>
              )}
              {member.known_for && (
                <div
                  className="rounded-xl px-6 py-4"
                  style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)' }}
                >
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Known for</p>
                  <p className="text-text text-sm leading-relaxed">{member.known_for}</p>
                </div>
              )}
              {member.fun_fact && (
                <div
                  className="rounded-xl px-6 py-4"
                  style={{ border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.05)' }}
                >
                  <p className="text-xs uppercase tracking-widest text-text-dim mb-1">Fun fact</p>
                  <p className="text-text text-sm leading-relaxed">{member.fun_fact}</p>
                </div>
              )}
            </div>
          )}

          <div className="event-card event-card-static border border-gold-soft rounded-xl px-8 py-6 text-left">
            <p className="text-gold font-display text-lg mb-1">You&#39;re on the list.</p>
            <p className="text-text-dim text-sm">
              We&#39;ll send details closer to October. Keep an eye on this site — more links and
              info will appear as plans lock in.
            </p>
          </div>

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
            <a href="/" className="text-text-dim text-sm hover:text-gold transition-colors">
              ← Back to home
            </a>
            <span className="text-text-dim text-sm">·</span>
            <a href="/members" className="text-text-dim text-sm hover:text-gold transition-colors">
              See all guests
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
