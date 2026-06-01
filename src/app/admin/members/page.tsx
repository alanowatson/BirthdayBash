import { supabaseAdmin } from '@/lib/supabase/server';
import type { Member } from '@/lib/types';
import { toggleAdminAction, toggleRefereeAction, setTripRsvpAction } from './actions';
import DeleteMemberButton from './DeleteMemberButton';

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function AdminMembersPage() {
  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  const members = (data ?? []) as Member[];

  const confirmed = members.filter((m) => m.trip_rsvp === 'yes').length;
  const declined  = members.filter((m) => m.trip_rsvp === 'no').length;
  const pending   = members.filter((m) => m.trip_rsvp === null).length;

  return (
    <div className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl text-gold mb-2">Members</h1>
        <p className="text-text-dim mb-6">{members.length} signed up so far.</p>

        {/* Trip RSVP summary */}
        <div className="flex gap-3 flex-wrap mb-10">
          {[
            { label: 'Confirmed', count: confirmed, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' },
            { label: 'Declined',  count: declined,  color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
            { label: 'No response', count: pending, color: '#9ca3af', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-3 rounded-xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="font-display text-2xl" style={{ color: s.color }}>{s.count}</span>
              <span className="text-sm" style={{ color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="event-card event-card-static border border-gold-soft rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={`/admin/members/${member.id}`} className="font-display text-lg text-gold hover:underline">{member.name}</a>
                  {member.trip_rsvp === 'yes' && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>✓ Coming</span>
                  )}
                  {member.trip_rsvp === 'no' && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>✗ Declined</span>
                  )}
                  {member.trip_rsvp === null && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af' }}>· No response</span>
                  )}
                  {member.is_admin && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}>
                      Admin
                    </span>
                  )}
                  {member.is_referee && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--sky)' }}>
                      Referee
                    </span>
                  )}
                </div>
                <p className="text-text-dim text-sm">{member.email}</p>
                {member.bio && <p className="text-text-dim text-xs mt-0.5 truncate">{member.bio}</p>}
                <p className="text-text-dim text-xs mt-1">Joined {formatDate(member.created_at)}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                <a
                  href={`/admin/members/${member.id}`}
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                  style={{ borderColor: 'var(--gold-soft)', color: 'var(--gold)' }}
                >
                  Edit profile
                </a>

                {/* Trip RSVP override */}
                {member.trip_rsvp !== 'yes' && (
                  <form action={setTripRsvpAction}>
                    <input type="hidden" name="id" value={member.id} />
                    <input type="hidden" name="value" value="yes" />
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                      style={{ borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80' }}>
                      Mark coming
                    </button>
                  </form>
                )}
                {member.trip_rsvp !== 'no' && (
                  <form action={setTripRsvpAction}>
                    <input type="hidden" name="id" value={member.id} />
                    <input type="hidden" name="value" value="no" />
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                      style={{ borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}>
                      Mark declined
                    </button>
                  </form>
                )}

                <form action={toggleAdminAction}>
                  <input type="hidden" name="id" value={member.id} />
                  <input type="hidden" name="current" value={String(member.is_admin)} />
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      borderColor: member.is_admin ? 'var(--gold)' : 'var(--gold-soft)',
                      color: member.is_admin ? 'var(--gold)' : 'var(--text-dim)',
                    }}
                  >
                    {member.is_admin ? 'Revoke admin' : 'Make admin'}
                  </button>
                </form>

                <form action={toggleRefereeAction}>
                  <input type="hidden" name="id" value={member.id} />
                  <input type="hidden" name="current" value={String(member.is_referee)} />
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      borderColor: member.is_referee ? 'var(--sky)' : 'var(--gold-soft)',
                      color: member.is_referee ? 'var(--sky)' : 'var(--text-dim)',
                    }}
                  >
                    {member.is_referee ? 'Revoke referee' : 'Make referee'}
                  </button>
                </form>

                <DeleteMemberButton id={member.id} name={member.name} />
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <p className="text-text-dim text-center py-12">No members yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
