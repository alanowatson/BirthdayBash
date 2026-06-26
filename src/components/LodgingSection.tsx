export default function LodgingSection() {
  return (
    <section id="lodging" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label section-label-blue mb-4">Where We&#39;re Staying</p>
          <h2 className="font-display text-5xl md:text-6xl gold-gradient mb-3">Lodging</h2>
          <p className="text-text-dim max-w-md mx-auto">
            Home base is The Cosmopolitan. The rest are within easy walking/Ubering distance.{' '}
            <a href="/travel" className="text-gold underline underline-offset-2 hover:opacity-80 transition-opacity">Share your travel plans</a> so the crew can coordinate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Cosmopolitan — featured */}
          <a
            href="https://www.cosmopolitanlasvegas.com/rooms-suites"
            target="_blank" rel="noreferrer"
            className="lodging-card lodging-card-primary border-2 border-gold rounded-lg p-8 md:col-span-2 block hover:border-gold transition-colors group"
          >
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <p className="section-label section-label-blue mb-2">Home Base</p>
                <h3 className="font-display text-4xl text-gold group-hover:opacity-80 transition-opacity">The Cosmopolitan</h3>
              </div>
              <span className="text-xs text-text-dim uppercase tracking-widest self-start mt-1">Book →</span>
            </div>
            <p className="text-text-dim leading-relaxed mb-4">
              Center Strip. Chandelier Bar is our default rally point. If you want to be where the
              action is and love 4 different speakeasies, stay here.
            </p>
          </a>

          <a
            href="https://vdara.mgmresorts.com/en.html"
            target="_blank" rel="noreferrer"
            className="lodging-card border border-gold-soft rounded-lg p-6 block hover:border-gold transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-2xl text-gold group-hover:opacity-80 transition-opacity">The Vdara</h3>
              <span className="text-xs text-text-dim uppercase tracking-widest">Book →</span>
            </div>
            <p className="text-text-dim text-sm mb-3">
              All-suite, no casino. Quiet retreat that connects to Cosmo via an indoor walkway.
            </p>
            <span className="text-xs text-sky uppercase tracking-widest">~5 min walk to Cosmo</span>
          </a>

          <a
            href="https://aria.mgmresorts.com/en.html"
            target="_blank" rel="noreferrer"
            className="lodging-card border border-gold-soft rounded-lg p-6 block hover:border-gold transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-2xl text-gold group-hover:opacity-80 transition-opacity">ARIA</h3>
              <span className="text-xs text-text-dim uppercase tracking-widest">Book →</span>
            </div>
            <p className="text-text-dim text-sm mb-3">
              Where Din Tai Fung lives. Big rooms, modern feel, across a path from the Vdara. Great middle ground.
            </p>
            <span className="text-xs text-sky uppercase tracking-widest">~7 min walk to Cosmo</span>
          </a>

          <a
            href="https://www.caesars.com/planet-hollywood/hotel/rooms"
            target="_blank" rel="noreferrer"
            className="lodging-card border border-gold-soft rounded-lg p-6 md:col-span-2 block hover:border-gold transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-2xl text-gold group-hover:opacity-80 transition-opacity">Planet Hollywood</h3>
              <span className="text-xs text-text-dim uppercase tracking-widest">Book →</span>
            </div>
            <p className="text-text-dim text-sm mb-3">
              Often the best value on the Strip. Right across the road from Cosmo.
            </p>
            <span className="text-xs text-sky uppercase tracking-widest">Directly across the Strip</span>
          </a>
        </div>

        <div
          className="mt-8 p-6 rounded-lg border border-blue"
          style={{ background: 'rgba(59, 130, 246, 0.06)' }}
        >
          <p className="section-label section-label-blue mb-2">Travel Recommendation</p>
          <p className="text-sm text-text leading-relaxed">
            <span className="text-gold font-semibold">Arrive:</span> Thursday night or Friday
            morning. Arriving before Friday noon gets you access to all events.
            <br />
            <span className="text-gold font-semibold">Depart:</span> Sunday night or Monday
            morning. Leaving early Sunday misses Stadium Swim, recovery, and scavenger hunt
            opportunities.
            <br />
            <span className="text-text-dim italic">
              Forced into a less-ideal itinerary? Reach out — Alan will recommend something to
              maximize fun/hour.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
