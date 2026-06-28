import { createAuthClient } from '@/lib/supabase/server-session';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import SignupSteps from '../SignupSteps';
import TravelForm from '../../travel/TravelForm';
import type { Travel } from '@/lib/types';

export const revalidate = 0;

export default async function SignupTravelPage() {
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

  const { data: travelData } = await supabaseAdmin
    .from('travel')
    .select('*')
    .eq('member_id', memberData.id)
    .maybeSingle();

  const myTravel = (travelData as Travel | null) ?? null;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <SignupSteps current={4} />
            <h1 className="font-display text-4xl gold-gradient mb-2">Travel Plans</h1>
            <p className="text-text-dim text-sm">
              All times are Las Vegas time (PDT). You can always add this later.
            </p>
          </div>

          <div className="event-card event-card-static border border-gold-soft rounded-xl p-6 mb-6">
            <TravelForm
              myMemberId={memberData.id}
              myTravel={myTravel}
              isAdmin={false}
              members={[]}
              allTravel={myTravel ? [myTravel] : []}
            />
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="/members"
              className="rsvp-chip px-6 py-3 rounded-full uppercase text-sm tracking-widest text-center"
            >
              Done — see who&apos;s coming →
            </a>
            <a
              href="/members"
              className="flex items-center justify-center px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-colors"
              style={{ border: '1px solid var(--gold-soft)', color: 'var(--text-dim)' }}
            >
              Skip — I&apos;ll add travel plans later
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
