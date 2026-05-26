export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <HeroSection />
      <VoiceBlock />
    </main>
  );
}

/* ===== Navigation ===== */
function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ background: "rgba(0,0,0,0.4)", borderColor: "var(--gold-soft)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gold text-2xl">◆</span>
          <span className="font-display text-xl tracking-widest text-text">VEGAS HYPE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-dim">
          <a href="#agenda" className="hover:text-gold transition-colors">Agenda</a>
          <a href="#lodging" className="hover:text-gold transition-colors">Lodging</a>
          <a href="#scavenger-hunt" className="hover:text-gold transition-colors">Scavenger Hunt</a>
          <a href="#members" className="hover:text-gold transition-colors">Who&#39;s Coming</a>
          <a href="#links" className="hover:text-gold transition-colors">Links</a>
          <a href="/me" className="hover:text-gold transition-colors">My RSVPs</a>
          <a href="/signup" className="rsvp-chip px-4 py-2 rounded-full text-xs">
            Get on the list
          </a>
        </div>
        {/* Mobile hamburger — placeholder for post-M1 */}
        <button className="md:hidden text-text-dim hover:text-gold transition-colors">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

/* ===== Hero ===== */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-bg">
      {/* Gradient glow overlay */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Sparkles */}
      <div className="sparkle" style={{ top: "20%", left: "15%", width: 3, height: 3, animationDelay: "0s" }} />
      <div className="sparkle sparkle-blue" style={{ top: "30%", left: "80%", width: 2, height: 2, animationDelay: "1s" }} />
      <div className="sparkle" style={{ top: "60%", left: "10%", width: 2, height: 2, animationDelay: "2s" }} />
      <div className="sparkle sparkle-blue" style={{ top: "70%", left: "85%", width: 3, height: 3, animationDelay: "1.5s" }} />
      <div className="sparkle" style={{ top: "45%", left: "50%", width: 2, height: 2, animationDelay: "0.5s" }} />
      <div className="sparkle sparkle-blue" style={{ top: "25%", left: "45%", width: 2, height: 2, animationDelay: "3s" }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Deco top */}
        <div className="deco-divider mb-8">
          <div className="deco-diamond" />
          <span className="section-label">Las Vegas · Oct 22—26, 2026</span>
          <div className="deco-diamond-blue" />
        </div>

        {/* Main title */}
        <h1 className="font-display text-7xl md:text-9xl leading-none gold-gradient mb-6">
          Vegas Hype
        </h1>

        {/* Subtitle */}
        <p className="font-serif-italic text-2xl md:text-3xl text-gold mb-2">
          The Big <span className="blue-gold-gradient font-display">4-0</span>.
        </p>
        <p className="font-serif-italic text-lg md:text-xl text-blue-bright mb-8">
          You&#39;re on the list.
        </p>

        {/* Tagline */}
        <p className="text-text-dim max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          They say life begins at 40. They also say what happens in Vegas stays in Vegas.{" "}
          <span className="text-gold">
            I&#39;m here to test both hypotheses simultaneously.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#agenda"
            className="rsvp-chip px-8 py-4 rounded-full uppercase text-sm tracking-widest"
          >
            Browse the Agenda
          </a>
          <a
            href="/signup"
            className="neon-blue px-8 py-4 rounded-full uppercase text-sm tracking-widest font-medium"
          >
            Confirm Your Seat
          </a>
        </div>

        {/* Deco bottom */}
        <div className="deco-divider mt-16">
          <div className="deco-diamond" />
          <div className="deco-diamond-blue" />
          <div className="deco-diamond" />
        </div>
      </div>
    </section>
  );
}

/* ===== Host's voice / invite block ===== */
function VoiceBlock() {
  return (
    <section
      className="py-20 px-6 border-t"
      style={{ borderColor: "var(--gold-soft)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-3">From the host</p>
          <h2 className="font-display text-4xl text-gold">
            Dearest degenerates and upstanding citizens alike,
          </h2>
        </div>
        <div className="pull-quote text-lg leading-relaxed text-text-dim space-y-4">
          <p>
            Mortgages. Kids&#39; soccer tournaments. That thing called{" "}
            <span className="text-gold">&ldquo;responsibility&rdquo;</span> we all pretend to
            understand. You&#39;ve got a year to negotiate your weekend pass, perfect your alibi,
            and bank a day of PTO.
          </p>
          <p>
            SOs are <span className="text-blue-bright">absolutely</span> invited. Misery loves
            company, and honestly, someone needs to document this with a steady hand.
          </p>
          <p>Tell your families you love them. Update your wills.</p>
          <p className="not-italic font-display text-2xl mt-6 text-gold">Xoxo, Alan</p>
        </div>
      </div>
    </section>
  );
}
