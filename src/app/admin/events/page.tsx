import { supabaseAdmin } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';

export const revalidate = 0;

const PT = 'America/Los_Angeles';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: PT,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default async function AdminEventsPage() {
  const { data } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true });

  const events = (data ?? []) as Event[];

  return (
    <div className="px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-gold mb-2">Events</h1>
        <p className="text-text-dim mb-10">Click an event to edit it.</p>

        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <a
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="event-card border border-gold-soft rounded-xl px-5 py-4 flex items-center justify-between hover:border-gold transition-colors group"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-display text-lg text-gold group-hover:underline">{event.title}</p>
                  {event.is_featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--blue-bright)' }}>
                      Centerpiece
                    </span>
                  )}
                </div>
                <p className="text-text-dim text-sm">{formatDateTime(event.starts_at)} PT</p>
                {event.location && <p className="text-text-dim text-xs">{event.location}</p>}
              </div>
              <span className="text-text-dim text-sm group-hover:text-gold transition-colors">Edit →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
