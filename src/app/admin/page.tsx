import { supabaseAdmin } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function AdminPage() {
  const [membersRes, rsvpsRes, linksRes, eventsRes, declinedRes] = await Promise.all([
    supabaseAdmin.from('members').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('rsvps').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('site_links').select('url, is_visible'),
    supabaseAdmin.from('events').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('members').select('trip_rsvp'),
  ]);

  const memberCount = membersRes.count ?? 0;
  const rsvpCount = rsvpsRes.count ?? 0;
  const eventCount = eventsRes.count ?? 0;
  const links = linksRes.data ?? [];
  const pendingLinks = links.filter((l) => !l.url).length;
  const liveLinks = links.filter((l) => l.url && l.is_visible).length;
  const allMembers = declinedRes.data ?? [];
  const confirmedCount = allMembers.filter((m) => m.trip_rsvp === 'yes').length;
  const declinedCount  = allMembers.filter((m) => m.trip_rsvp === 'no').length;

  const stats = [
    { label: 'Members', value: memberCount, href: '/admin/members', note: 'signed up' },
    { label: 'Confirmed', value: confirmedCount, href: '/admin/members', note: 'coming to Vegas' },
    { label: 'Declined', value: declinedCount, href: '/admin/members', note: 'can\'t make it' },
    { label: 'Links live', value: liveLinks, href: '/admin/links', note: `${pendingLinks} still pending` },
  ];

  return (
    <div className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-gold mb-2">Admin Overview</h1>
        <p className="text-text-dim mb-12">Site health at a glance.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => {
            const inner = (
              <div className="event-card event-card-static border border-gold-soft rounded-xl p-6 h-full">
                <p className="font-display text-4xl text-gold mb-1">{s.value}</p>
                <p className="text-text text-sm font-medium">{s.label}</p>
                <p className="text-text-dim text-xs mt-1">{s.note}</p>
              </div>
            );
            return s.href ? (
              <a key={s.label} href={s.href} className="block hover:opacity-80 transition-opacity">
                {inner}
              </a>
            ) : (
              <div key={s.label}>{inner}</div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/admin/links"
            className="event-card border border-gold-soft rounded-xl p-6 block hover:border-gold transition-colors"
          >
            <p className="font-display text-xl text-gold mb-1">Manage Links →</p>
            <p className="text-text-dim text-sm">
              Add URLs to pending links, update descriptions, control visibility.
            </p>
          </a>
          <a
            href="/admin/members"
            className="event-card border border-gold-soft rounded-xl p-6 block hover:border-gold transition-colors"
          >
            <p className="font-display text-xl text-gold mb-1">Manage Members →</p>
            <p className="text-text-dim text-sm">
              View all guests, grant admin access, review sign-ups.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
