import { supabaseAdmin } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Member, Travel } from '@/lib/types';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import ProfileStep from './ProfileStep';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

function StepIndicator() {
  const steps = [
    { n: 1, label: 'Your info' },
    { n: 2, label: 'The schedule' },
    { n: 3, label: 'Your profile' },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && <div className="w-12 h-px mx-1" style={{ background: 'var(--gold-soft)' }} />}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono-x transition-all"
              style={{
                background: n === 3 ? 'var(--gold)' : 'rgba(212,175,55,0.2)',
                color: n === 3 ? '#07101F' : 'var(--gold)',
                border: n !== 3 ? '1px solid var(--gold-soft)' : 'none',
              }}
            >
              {n < 3 ? '✓' : 3}
            </div>
            <span className="text-xs" style={{ color: n === 3 ? 'var(--gold)' : 'var(--text-dim)' }}>
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProfileStepPage({ params }: Props) {
  const { slug } = await params;

  const memberRes = await supabaseAdmin
    .from('members')
    .select('id, name, photo_url, obsession, fun_fact, tshirt_size')
    .eq('slug', slug)
    .maybeSingle();

  if (!memberRes.data) notFound();
  const member = memberRes.data as Pick<Member, 'id' | 'name' | 'photo_url' | 'obsession' | 'fun_fact' | 'tshirt_size'>;

  const travelRes = await supabaseAdmin
    .from('travel')
    .select('*')
    .eq('member_id', member.id)
    .maybeSingle();

  const travel = (travelRes.data ?? null) as Travel | null;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 px-6 py-24">
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-10">
            <p className="section-label section-label-blue mb-4">Almost there</p>
            <h1 className="font-display text-4xl md:text-5xl gold-gradient mb-2">
              Your Profile
            </h1>
            <p className="text-text-dim text-sm">
              Add a photo, a few details, and your travel plans. All optional — skip anything.
            </p>
          </div>

          <StepIndicator />

          <ProfileStep
            slug={slug}
            name={member.name}
            currentPhotoUrl={member.photo_url}
            obsession={member.obsession}
            fun_fact={member.fun_fact}
            tshirt_size={member.tshirt_size}
            travel={travel}
          />

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
