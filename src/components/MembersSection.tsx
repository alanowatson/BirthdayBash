import type { Member } from '@/lib/types';
import { CREWS, type CrewKey } from '@/lib/crews';

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function crewRing(groups: string[]): string {
  const colors = groups.map((g) => CREWS[g as CrewKey]?.color).filter(Boolean) as string[];
  if (colors.length === 0) return 'rgba(212,175,55,0.3)';
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}80)`;
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}

function crewAvatarBg(groups: string[]): string {
  const colors = groups.map((g) => CREWS[g as CrewKey]?.color).filter(Boolean) as string[];
  if (colors.length === 0) return 'linear-gradient(135deg, #D4AF37, #3B82F6)';
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}40, ${colors[0]}15)`;
  const stops = colors.map((c, i) => `${c}${i % 2 === 0 ? '40' : '20'}`).join(', ');
  return `linear-gradient(135deg, ${stops})`;
}

export default function MembersSection({ members }: { members: Member[] }) {
  const visible = members.slice(0, 8);
  const overflow = members.length - visible.length;

  return (
    <section
      id="members"
      className="py-24 px-6 border-t"
      style={{ borderColor: 'var(--gold-soft)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">The Guest List</p>
          <h2 className="font-display text-5xl md:text-6xl gold-gradient mb-3">
            Who&#39;s Coming
          </h2>
          <p className="text-text-dim max-w-md mx-auto">
            {members.length > 0
              ? `${members.length} confirmed and counting. SOs absolutely invited.`
              : 'Be the first to RSVP. SOs absolutely invited.'}
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-dim mb-6">No one&#39;s on the list yet. Fix that.</p>
            <a href="/signup" className="rsvp-chip px-8 py-4 rounded-full uppercase text-sm tracking-widest inline-block">
              Get on the list
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {visible.map((member) => {
                const groups = member.group ?? [];
                const primaryCrew = groups.length ? CREWS[groups[0] as CrewKey] : null;
                return (
                  <a
                    key={member.id}
                    href={`/members/${member.slug}`}
                    className="event-card rounded-lg p-5 text-center block transition-all"
                    style={{
                      border: `1px solid ${primaryCrew ? primaryCrew.color + '50' : 'rgba(212,175,55,0.2)'}`,
                    }}
                  >
                    {/* Avatar with crew-colored ring (gradient if multiple groups) */}
                    <div
                      className="mx-auto mb-3 rounded-full flex-shrink-0"
                      style={{ width: 68, height: 68, padding: 3, background: crewRing(groups) }}
                    >
                      <div
                        className="avatar w-full h-full"
                        style={{
                          fontSize: '1.25rem',
                          background: member.photo_url ? undefined : crewAvatarBg(groups),
                        }}
                      >
                        {member.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          initials(member.name)
                        )}
                      </div>
                    </div>

                    <p className="font-display text-lg text-gold leading-tight mb-1.5">{member.name}</p>

                    {/* One pill per crew */}
                    {groups.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mb-1">
                        {groups.map((g) => {
                          const crew = CREWS[g as CrewKey];
                          if (!crew) return null;
                          return (
                            <span
                              key={g}
                              className="inline-block text-xs px-2 py-0.5 rounded-full tracking-wide"
                              style={{
                                color: crew.color,
                                background: crew.color + '18',
                                border: `1px solid ${crew.color}35`,
                              }}
                            >
                              {crew.short}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {member.bio && (
                      <p className="text-xs text-text-dim line-clamp-1 mt-1">{member.bio}</p>
                    )}
                    {member.is_referee && (
                      <p className="text-xs text-sky mt-1">Referee</p>
                    )}
                  </a>
                );
              })}
            </div>

            {overflow > 0 && (
              <div className="text-center mt-10">
                <a
                  href="/members"
                  className="text-gold hover:underline text-sm uppercase tracking-widest"
                >
                  See all {members.length} guests →
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
