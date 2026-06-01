import type { Member } from '@/lib/types';

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #D4AF37, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #D4AF37)',
  'linear-gradient(135deg, #38BDF8, #3B82F6)',
  'linear-gradient(135deg, #3B82F6, #38BDF8)',
  'linear-gradient(135deg, #D4AF37, #38BDF8)',
];

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
              {visible.map((member, i) => (
                <a
                  key={member.id}
                  href={`/members/${member.slug}`}
                  className="event-card border border-gold-soft rounded-lg p-5 text-center block"
                >
                  <div
                    className="avatar mx-auto mb-3"
                    style={{
                      width: 64,
                      height: 64,
                      fontSize: '1.25rem',
                      background: member.photo_url
                        ? undefined
                        : AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
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
                  <p className="font-display text-lg text-gold">{member.name}</p>
                  {member.bio && (
                    <p className="text-xs text-text-dim mb-2 line-clamp-1">{member.bio}</p>
                  )}
                  {member.is_referee && (
                    <p className="text-xs text-sky">Referee</p>
                  )}
                </a>
              ))}
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
