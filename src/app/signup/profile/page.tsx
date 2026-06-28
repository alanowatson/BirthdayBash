import { createAuthClient } from '@/lib/supabase/server-session';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import SignupSteps from '../SignupSteps';
import PhotoUpload from '../../me/PhotoUpload';
import ProfileSetupForm from './ProfileSetupForm';
import type { Member } from '@/lib/types';

export const revalidate = 0;

export default async function SignupProfilePage() {
  let user = null;
  try {
    const supabase = await createAuthClient();
    const res = await supabase.auth.getUser();
    user = res.data.user ?? null;
  } catch {
    /* no cookie context */
  }

  if (!user?.email) redirect('/signup');

  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('email', user.email)
    .maybeSingle();

  if (!data) redirect('/signup');
  const member = data as Member;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <SignupSteps current={2} />
            <h1 className="font-display text-4xl gold-gradient mb-2">Your Profile</h1>
            <p className="text-text-dim text-sm">
              Help the crew get to know you before Vegas.
            </p>
          </div>

          {/* Photo — optional, auto-uploads on file pick */}
          <div
            className="event-card event-card-static border border-gold-soft rounded-xl p-6 mb-4"
          >
            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">
              Photo{' '}
              <span className="normal-case text-text-dim">(optional — you can add this later)</span>
            </p>
            <PhotoUpload currentUrl={member.photo_url} name={member.name} />
          </div>

          {/* Profile fields */}
          <ProfileSetupForm
            bio={member.bio}
            obsession={member.obsession}
            tshirt_size={member.tshirt_size}
          />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
