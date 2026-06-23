import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TabSwitcher from './TabSwitcher';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Maps · Alan's 40th" };

export default function MapPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 text-center">
        <p className="section-label section-label-blue mb-4">Navigate the Weekend</p>
        <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-4">The Map</h1>
        <p className="text-text-dim text-lg max-w-xl mx-auto">
          Where we are, where we&apos;re going, and how to get there from wherever you&apos;re
          staying. Strip view and Downtown view. Indoor floor guide for The Cosmopolitan.
        </p>
      </section>

      <section className="flex-1 px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <TabSwitcher />
        </div>
      </section>

      {/* Where is Alan link */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <a
            href="/where-is-alan"
            className="flex items-center justify-between px-6 py-4 rounded-xl transition-all group"
            style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.04)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-display text-base text-gold">Where is Alan?</p>
                <p className="text-text-dim text-xs">Live location tracking — on during select events</p>
              </div>
            </div>
            <span className="text-text-dim group-hover:text-gold transition-colors text-lg">→</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
