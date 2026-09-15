export default function VoiceBlock() {
  return (
    <section className="py-20 px-6 border-t" style={{ borderColor: 'var(--gold-soft)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-3">From the host</p>
          <h2 className="font-display text-4xl text-gold">
            Dearest degenerates and upstanding citizens alike,
          </h2>
        </div>
        <div className="pull-quote text-lg leading-relaxed text-text-dim space-y-4">
          <p>
            Thank you for saying yes to this. I really appreciate you all coming, and I think your{' '}
            <span className="text-gold">60 year old self will thank you</span>. Your body may hold a grudge.
          </p>
          <p>
            As you can all tell, I have been dreaming of this weekend — getting an elite group of
            people together. I never had a bachelor party{' '}
            <span className="text-text-dim">(thanks Covid)</span>{' '}so thanks for letting me go a
            little off the deep end in a post-kids world.
          </p>
          <p>
            I hope I&apos;ve{' '}
            <span className="text-gold">stacked the deck</span>{' '}enough for us to have the time of our lives.
          </p>
          <p className="not-italic font-display text-2xl mt-6 text-gold">Xoxo, Alan</p>
        </div>
      </div>
    </section>
  );
}
