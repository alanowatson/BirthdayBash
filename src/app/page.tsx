import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuthClient } from '@/lib/supabase/server-session';
import type { Event, Member, SiteLink } from '@/lib/types';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import VoiceBlock from '@/components/VoiceBlock';
import AgendaSection from '@/components/AgendaSection';
import LodgingSection from '@/components/LodgingSection';
import ScavengerTeaser from '@/components/ScavengerTeaser';
import MembersSection from '@/components/MembersSection';
import LinksSection from '@/components/LinksSection';
import CtaSection from '@/components/CtaSection';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 0;

export default async function HomePage() {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  const [eventsRes, membersRes, linksRes, currentMemberRes] = await Promise.all([
    supabaseAdmin.from('events').select('*').order('starts_at', { ascending: true }),
    supabaseAdmin.from('members').select('*').order('created_at', { ascending: true }),
    supabaseAdmin.from('site_links').select('*').eq('is_visible', true).order('display_order', { ascending: true }),
    user?.email
      ? supabaseAdmin.from('members').select('id').eq('email', user.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const events     = (eventsRes.data ?? []) as Event[];
  const members    = (membersRes.data ?? []) as Member[];
  const links      = (linksRes.data ?? []) as SiteLink[];
  const isSignedIn = !!currentMemberRes.data?.id;

  // Build a map of event_id → rsvp status for the logged-in user
  let myRsvps: Record<string, string> = {};
  if (currentMemberRes.data?.id) {
    const { data: rsvpRows } = await supabaseAdmin
      .from('rsvps')
      .select('event_id, status')
      .eq('member_id', currentMemberRes.data.id);
    myRsvps = Object.fromEntries((rsvpRows ?? []).map((r) => [r.event_id, r.status]));
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero isSignedIn={isSignedIn} />
      <VoiceBlock />
      <AgendaSection events={events} myRsvps={myRsvps} />
      <div className="max-w-2xl mx-auto px-6">
        <div className="deco-divider py-8">
          <div className="deco-diamond" />
          <div className="deco-diamond-blue" />
          <div className="deco-diamond" />
        </div>
      </div>
      <LodgingSection />
      <ScavengerTeaser />
      <MembersSection members={members} />
      <LinksSection links={links} />
      <CtaSection isSignedIn={isSignedIn} />
      <SiteFooter />
    </main>
  );
}
