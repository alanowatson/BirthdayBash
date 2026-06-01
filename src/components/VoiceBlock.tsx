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
            Mortgages. Kids&#39; soccer tournaments. That thing called{' '}
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
