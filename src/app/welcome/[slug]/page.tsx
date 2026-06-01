import { supabaseAdmin } from '@/lib/supabase/server';
import type { Member, Event } from '@/lib/types';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import EventsForm from './EventsForm';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

function StepIndicator() {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {[
        { n: 1, label: 'Your info', done: true },
        { n: 2, label: 'The schedule', done: false },
      ].map(({ n, label, done }, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && (
            <div className="w-16 h-px mx-1" style={{ background: 'var(--gold-soft)' }} />
          )}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono-x transition-all"
              style={{
                background: !done ? 'var(--gold)' : 'rgba(212,175,55,0.2)',
                color: !done ? '#07101F' : 'var(--gold)',
                border: done ? '1px solid var(--gold-soft)' : 'none',
              }}
            >
              {done ? '✓' : n}
            </div>
            <span className="text-xs" style={{ color: !done ? 'var(--gold)' : 'var(--text-dim)' }}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function WelcomeStep2Page({ params }: Props) {
  const { slug } = await params;

  const [memberRes, eventsRes] = await Promise.all([
    supabaseAdmin.from('members').select('id, name').eq('slug', slug).maybeSingle(),
    supabaseAdmin
      .from('events')
      .select('id, title, slug, starts_at, ends_at, location, description, pricing_tiers, is_featured, display_order, created_at, updated_at')
      .order('starts_at', { ascending: true }),
  ]);

  if (!memberRes.data) notFound();

  const member = memberRes.data as Pick<Member, 'id' | 'name'>;
  const events = (eventsRes.data ?? []) as Event[];

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 px-6 py-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="section-label section-label-blue mb-4">You&#39;re invited</p>
            <h1 className="font-display text-4xl md:text-5xl gold-gradient mb-2">
              The Schedule
            </h1>
            <p className="text-text-dim text-sm">
              Mark your interest for each event. No pressure — skip anything and come back later.
            </p>
          </div>

          <StepIndicator />

          <EventsForm
            events={events}
            memberId={member.id}
            slug={slug}
            memberName={member.name}
          />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
