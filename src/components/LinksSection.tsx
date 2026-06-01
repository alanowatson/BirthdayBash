import type { SiteLink, LinkIcon } from '@/lib/types';

const ICON_MAP: Record<LinkIcon, string> = {
  drive: '📸',
  chat: '💬',
  money: '💸',
  calendar: '📅',
  link: '🔗',
};

function LinkCard({ link }: { link: SiteLink }) {
  const isPending = !link.url;
  const icon = ICON_MAP[link.icon] ?? '🔗';

  const inner = (
    <div className={`link-card ${isPending ? 'is-pending' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="link-icon">{icon}</div>
        <h3 className="font-display text-2xl text-gold leading-tight">{link.title}</h3>
      </div>
      {link.description && (
        <p className="text-text-dim text-sm leading-relaxed mb-5 line-clamp-4">
          {link.description}
        </p>
      )}
      {isPending ? (
        <span className="pending-pill">◇ Link pending</span>
      ) : (
        <span className="live-pill">Open →</span>
      )}
    </div>
  );

  if (isPending) {
    return <div>{inner}</div>;
  }

  return (
    <a href={link.url!} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}

export default function LinksSection({ links }: { links: SiteLink[] }) {
  return (
    <section
      id="links"
      className="py-24 px-6 border-t"
      style={{ borderColor: 'var(--gold-soft)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label section-label-blue mb-4">Resources</p>
          <h2 className="font-display text-5xl md:text-6xl gold-gradient mb-3">
            Important Links
          </h2>
          <p className="text-text-dim max-w-xl mx-auto">
            Photos, group chat, expenses — everything you&#39;ll need over the weekend, in one
            place. Admin can add or update at any time.
          </p>
        </div>

        {links.length === 0 ? (
          <p className="text-center text-text-dim">More resources coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}

        <p className="text-center text-text-dim text-xs italic">
          Admin can add, edit, or remove links from{' '}
          <span className="text-gold font-mono-x">/admin/links</span> at any time.
        </p>
      </div>
    </section>
  );
}
