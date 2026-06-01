import { createAuthClient } from '@/lib/supabase/server-session';
import { supabaseAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) redirect('/me');

  const { data: member } = await supabaseAdmin
    .from('members')
    .select('is_admin, name')
    .eq('email', user.email)
    .maybeSingle();

  if (!member?.is_admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="font-display text-4xl text-gold mb-3">Access Denied</p>
        <p className="text-text-dim mb-6">This area requires admin privileges.</p>
        <a href="/" className="text-gold text-sm hover:underline">← Back to site</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{ background: 'rgba(0,0,0,0.6)', borderColor: 'var(--gold-soft)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <a href="/" className="text-text-dim text-sm hover:text-gold transition-colors">← Site</a>
          <span className="text-gold-soft">·</span>
          <span className="font-display text-gold text-lg">Admin</span>
          <div className="flex items-center gap-5 ml-4 text-sm">
            <a href="/admin" className="text-text-dim hover:text-gold transition-colors">Overview</a>
            <a href="/admin/events" className="text-text-dim hover:text-gold transition-colors">Events</a>
            <a href="/admin/links" className="text-text-dim hover:text-gold transition-colors">Links</a>
            <a href="/admin/members" className="text-text-dim hover:text-gold transition-colors">Members</a>
          </div>
          <div className="ml-auto text-xs text-text-dim">{member.name}</div>
        </div>
      </nav>
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
