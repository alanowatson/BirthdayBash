import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export default function SignupDeclinedPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <p className="text-5xl mb-8">🎲</p>

          <p className="section-label mb-4">RSVP Received</p>
          <h1 className="font-display text-5xl gold-gradient mb-6">We&apos;ll Miss You</h1>

          <p className="text-text-dim leading-relaxed mb-8">
            Totally understand — life happens. Thanks for letting us know. If anything changes,
            just come back and update your RSVP.
          </p>

          <p className="text-text-dim text-sm mb-8">
            Changed your mind?{' '}
            <a href="/signup" className="text-gold hover:underline">
              Update your RSVP →
            </a>
          </p>

          <a href="/" className="text-text-dim text-sm hover:text-gold transition-colors">
            ← Back to home
          </a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
