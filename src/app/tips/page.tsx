import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import TipsCarousel from './TipsCarousel';
import { TIPS } from '@/lib/tips';

export const metadata = { title: "Insider Tips · Alan's 40th" };

export default function TipsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <p className="section-label section-label-blue mb-4">Insider Guide</p>
        <h1 className="font-display text-5xl md:text-7xl gold-gradient mb-4">
          Top {TIPS.length} Tips
        </h1>
        <p className="text-text-dim text-lg max-w-md mx-auto">
          October 2026 · Las Vegas. The things worth knowing before you get there.
        </p>
        <div className="w-16 h-px mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
      </section>

      {/* Carousel */}
      <section className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <TipsCarousel />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
