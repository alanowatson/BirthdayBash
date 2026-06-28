import { createAuthClient } from '@/lib/supabase/server-session';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import SignupSteps from '../SignupSteps';
import EventsSetupForm from './EventsSetupForm';
import type { Event, Rsvp } from '@/lib/types';

export const revalidate = 0;

export default async function SignupEventsPage() {
  let user = null;
  try {
    const supabase = await createAuthClient();
    const res = await supabase.auth.getUser();
    user = res.data.user ?? null;
  } catch {
    /* no cookie context */
  }

  if (!user?.email) redirect('/signup');

  const { data: memberData } = await supabaseAdmin
    .from('members')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();

  if (!memberData) redirect('/signup');

  const [eventsRes, rsvpRes] = await Promise.all([
    supabaseAdmin
      .from('events')
      .select('id, title, slug, starts_at')
      .order('display_order', { ascending: true }),
    supabaseAdmin.from('rsvps').select('status, event_id').eq('member_id', memberData.id),
  ]);

  const events = (eventsRes.data ?? []) as Pick<Event, 'id' | 'title' | 'slug' | 'starts_at'>[];
  const rsvpMap = Object.fromEntries(
    ((rsvpRes.data ?? []) as Pick<Rsvp, 'status' | 'event_id'>[]).map((r) => [r.event_id, r.status])
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <SignupSteps current={3} />
            <h1 className="font-display text-4xl gold-gradient mb-2">The Schedule</h1>
            <p className="text-text-dim text-sm">
              Let us know which events you&apos;re planning to join.
            </p>
          </div>

          <EventsSetupForm memberId={memberData.id} events={events} rsvpMap={rsvpMap} />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
