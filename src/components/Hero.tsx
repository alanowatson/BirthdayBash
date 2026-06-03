import Countdown from './Countdown';

export default function Hero({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-bg">
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Sparkles */}
      <div className="sparkle" style={{ top: '20%', left: '15%', width: 3, height: 3, animationDelay: '0s' }} />
      <div className="sparkle sparkle-blue" style={{ top: '30%', left: '80%', width: 2, height: 2, animationDelay: '1s' }} />
      <div className="sparkle" style={{ top: '60%', left: '10%', width: 2, height: 2, animationDelay: '2s' }} />
      <div className="sparkle sparkle-blue" style={{ top: '70%', left: '85%', width: 3, height: 3, animationDelay: '1.5s' }} />
      <div className="sparkle" style={{ top: '45%', left: '50%', width: 2, height: 2, animationDelay: '0.5s' }} />
      <div className="sparkle sparkle-blue" style={{ top: '25%', left: '45%', width: 2, height: 2, animationDelay: '3s' }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="deco-divider mb-8">
          <div className="deco-diamond" />
          <span className="section-label">Las Vegas · Oct 22—26, 2026</span>
          <div className="deco-diamond-blue" />
        </div>

        <h1 className="font-display text-7xl md:text-9xl leading-none gold-gradient mb-4">
          Alan&#39;s 40th
        </h1>

        <p className="font-serif-italic text-2xl md:text-3xl text-blue-bright mb-2">
          The 4th Awakens.
        </p>
        <p className="font-serif-italic text-lg md:text-xl text-gold mb-8">
          You&#39;re on the list.
        </p>

        <p className="text-text-dim max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Some milestones you mark quietly.{' '}
          <span className="text-gold">I&#39;ve never been good at quiet.</span>
        </p>

        <Countdown />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#agenda" className="rsvp-chip px-8 py-4 rounded-full uppercase text-sm tracking-widest">
            Browse the Agenda
          </a>
          {!isSignedIn && (
            <a href="/signup" className="neon-blue px-8 py-4 rounded-full uppercase text-sm tracking-widest font-medium">
              Confirm Your Seat
            </a>
          )}
        </div>

        <div className="deco-divider mt-16">
          <div className="deco-diamond" />
          <div className="deco-diamond-blue" />
          <div className="deco-diamond" />
        </div>
      </div>
    </section>
  );
}
