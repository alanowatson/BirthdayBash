import { createAuthClient } from '@/lib/supabase/server-session';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Member, Event, Rsvp } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import ProfileForm from './ProfileForm';
import MagicLinkForm from './MagicLinkForm';
import PhotoUpload from './PhotoUpload';
import { bulkUpdateUserRsvpsAction } from './actions';

export const revalidate = 0;

const PT = 'America/Los_Angeles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default async function MePage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return (
      <main className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <p className="section-label mb-4">My Profile</p>
              <h1 className="font-display text-5xl gold-gradient mb-3">Your Space</h1>
              <p className="text-text-dim">Sign in to edit your profile and manage RSVPs.</p>
            </div>
            <MagicLinkForm />
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const { data: memberData } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('email', user.email)
    .maybeSingle();

  const member = memberData as Member | null;

  if (!member) {
    return (
      <main className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-md text-center">
            <p className="text-text-dim mb-4">No profile found for {user.email}.</p>
            <a href="/signup" className="rsvp-chip px-6 py-3 rounded-full text-sm uppercase tracking-widest inline-block">
              Create profile →
            </a>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const [eventsRes, rsvpRes] = await Promise.all([
    supabaseAdmin.from('events').select('id, title, slug, starts_at').order('display_order', { ascending: true }),
    supabaseAdmin.from('rsvps').select('status, event_id').eq('member_id', member.id),
  ]);

  const events = (eventsRes.data ?? []) as Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  const rsvpMap = Object.fromEntries(
    ((rsvpRes.data ?? []) as Pick<Rsvp, 'status' | 'event_id'>[]).map((r) => [r.event_id, r.status])
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 px-6 py-24">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-12">
            <p className="section-label mb-4">My Profile</p>
            <h1 className="font-display text-5xl gold-gradient mb-2">{member.name}</h1>
            <p className="text-text-dim text-sm">{user.email}</p>
            {member.is_admin && (
              <a href="/admin" className="inline-block mt-3 text-xs text-gold border border-gold-soft rounded-full px-4 py-1 hover:border-gold transition-colors">
                Admin panel →
              </a>
            )}
          </div>

          {/* Photo + profile edit */}
          <div className="event-card event-card-static border border-gold-soft rounded-xl p-8 mb-8">
            <h2 className="font-display text-2xl text-gold mb-6">Edit Profile</h2>
            <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--gold-soft)' }}>
              <PhotoUpload currentUrl={member.photo_url} name={member.name} />
            </div>
            <ProfileForm name={member.name} bio={member.bio} obsession={member.obsession} />
          </div>

          {/* RSVPs */}
          <div className="event-card event-card-static border border-gold-soft rounded-xl p-8">
            <h2 className="font-display text-2xl text-gold mb-6">My RSVPs</h2>
            <form action={bulkUpdateUserRsvpsAction} className="flex flex-col gap-0">
              {events.map((event) => {
                const currentStatus = rsvpMap[event.id] ?? 'none';
                return (
                  <div key={event.id} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--gold-soft)' }}>
                    <input type="hidden" name="event_ids" value={event.id} />

                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm text-text truncate">{event.title}</p>
                      <p className="text-xs text-text-dim whitespace-nowrap">{formatDate(event.starts_at)}</p>
                    </div>

                    <select
                      name={`rsvp_${event.id}`}
                      defaultValue={currentStatus}
                      className="field-input flex-shrink-0 text-xs py-1.5 px-2"
                      style={{ width: 130 }}
                    >
                      <option value="none">— No RSVP</option>
                      <option value="attending">Attending</option>
                      <option value="maybe">Maybe</option>
                      <option value="not_attending">Not attending</option>
                    </select>
                  </div>
                );
              })}

              <button
                type="submit"
                className="rsvp-chip px-5 py-2.5 rounded-full uppercase text-xs tracking-widest mt-5 self-start"
              >
                Save RSVPs
              </button>
            </form>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
