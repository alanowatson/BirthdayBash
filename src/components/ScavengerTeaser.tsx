export default function ScavengerTeaser() {
  return (
    <section
      id="scavenger-hunt"
      className="py-20 px-6 border-t"
      style={{ borderColor: 'var(--gold-soft)', background: 'rgba(10, 26, 62, 0.4)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-label mb-4">The Side Game</p>
        <h2 className="font-display text-4xl md:text-5xl gold-gradient mb-4">
          The Great T-Rex Scavenger Hunt 2.0
        </h2>
        <p className="text-text-dim text-lg leading-relaxed mb-8">
          52 tasks. One weekend. A gold-foil deck of poker cards as souvenirs. Bragging rights,
          eternal glory, and a sizable chunk of your weekend split for the winner.
        </p>

        <div
          className="inline-block px-6 py-4 rounded-lg border mb-8 text-sm text-text-dim"
          style={{ borderColor: 'var(--gold-soft)', background: 'rgba(212, 175, 55, 0.06)' }}
        >
          <span className="text-gold">🔒</span> The board reveals on{' '}
          <span className="text-blue-bright font-semibold">October 15, 2026</span>. Study up. Strategize.
        </div>

        <div>
          <a href="/scavenger-hunt" className="neon-blue px-8 py-4 rounded-full uppercase text-sm tracking-widest font-medium inline-block">
            View the board →
          </a>
        </div>
      </div>
    </section>
  );
}
