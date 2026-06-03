import { supabaseAdmin } from '@/lib/supabase/server';
import type { Member, Event, Rsvp } from '@/lib/types';
import { notFound } from 'next/navigation';
import { updateMemberAction, bulkUpdateRsvpsAction } from './actions';
import AdminPhotoUpload from './AdminPhotoUpload';

export const revalidate = 0;

const PT = 'America/Los_Angeles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: PT, weekday: 'short', month: 'short', day: 'numeric',
  });
}

type RsvpRow = { status: Rsvp['status']; event_id: string };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminMemberDetailPage({ params }: Props) {
  const { id } = await params;

  const [memberRes, eventsRes, rsvpsRes] = await Promise.all([
    supabaseAdmin.from('members').select('*').eq('id', id).maybeSingle(),
    supabaseAdmin.from('events').select('id, title, slug, starts_at').order('starts_at', { ascending: true }),
    supabaseAdmin.from('rsvps').select('status, event_id').eq('member_id', id),
  ]);

  if (!memberRes.data) notFound();

  const member = memberRes.data as Member;
  const events = (eventsRes.data ?? []) as Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  const rsvps = (rsvpsRes.data ?? []) as RsvpRow[];
  const rsvpMap = Object.fromEntries(rsvps.map((r) => [r.event_id, r.status]));

  return (
    <div className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <a href="/admin/members" className="text-text-dim text-sm hover:text-gold transition-colors mb-8 inline-block">
          ← All members
        </a>

        <h1 className="font-display text-4xl text-gold mb-8">{member.name}</h1>

        {/* Profile edit */}
        <div className="event-card event-card-static border border-gold-soft rounded-xl p-6 mb-8">
          <h2 className="font-display text-2xl text-gold mb-5">Profile</h2>

          {/* Photo upload — separate form, auto-saves on file pick */}
          <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--gold-soft)' }}>
            <AdminPhotoUpload memberId={member.id} currentUrl={member.photo_url} name={member.name} />
          </div>

          <form action={updateMemberAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={member.id} />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-text-dim">Name *</label>
                <input name="name" type="text" required defaultValue={member.name} className="field-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-text-dim">Slug *</label>
                <input name="slug" type="text" required defaultValue={member.slug} className="field-input" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-dim">Bio <span className="normal-case text-text-dim">(self-written)</span></label>
              <input name="bio" type="text" defaultValue={member.bio ?? ''} className="field-input" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-dim">Will talk your ear off about <span className="normal-case text-text-dim">(self-submitted)</span></label>
              <input name="obsession" type="text" defaultValue={member.obsession ?? ''} className="field-input" placeholder="e.g. Fantasy football, hot sauces, etc." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-dim">T-Shirt Size</label>
              <select name="tshirt_size" defaultValue={member.tshirt_size ?? ''} className="field-input">
                <option value="">— Not set</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-dim">Known for <span className="normal-case text-text-dim">(admin — shown on profile)</span></label>
              <input name="known_for" type="text" defaultValue={member.known_for ?? ''} className="field-input" placeholder="e.g. The instigator. Has never turned down a dare." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-text-dim">Fun fact <span className="normal-case text-text-dim">(admin — shown on profile)</span></label>
              <input name="fun_fact" type="text" defaultValue={member.fun_fact ?? ''} className="field-input" placeholder="e.g. Once ate 40 wings in a single sitting." />
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs text-text-dim">
              <span>Email: {member.email}</span>
              <span>·</span>
              <span>Joined: {new Date(member.created_at).toLocaleDateString()}</span>
            </div>

            <button type="submit" className="rsvp-chip px-5 py-2.5 rounded-full uppercase text-xs tracking-widest mt-1 self-start">
              Save profile
            </button>
          </form>
        </div>

        {/* RSVP management */}
        <div className="event-card event-card-static border border-gold-soft rounded-xl p-6">
          <h2 className="font-display text-2xl text-gold mb-5">RSVPs</h2>
          <form action={bulkUpdateRsvpsAction} className="flex flex-col gap-0">
            <input type="hidden" name="member_id" value={member.id} />
            <input type="hidden" name="member_page_id" value={id} />

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
  );
}
