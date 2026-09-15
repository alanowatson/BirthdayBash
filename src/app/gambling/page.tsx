import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import GamblingGuide from './GamblingGuide';

export const metadata = { title: "Alan's Gambling Academy · Alan's 40th" };

export default function GamblingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <p className="section-label mb-4">The Education</p>
        <h1 className="font-display text-5xl md:text-7xl gold-gradient mb-4">
          Alan&apos;s Gambling Academy
        </h1>
        <p className="text-text-dim text-lg max-w-xl mx-auto">
          Alan&apos;s here to help you look like you know what you&apos;re doing,
          plus Alan&apos;s favorite strategies to play Roulette and Craps.
        </p>
        <div className="w-16 h-px mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
      </section>

      <GamblingGuide />

      <SiteFooter />
    </main>
  );
}
