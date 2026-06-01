export default function CtaSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  if (isSignedIn) return null;
  return (
    <section
      id="signup"
      className="py-24 px-6 relative overflow-hidden border-t"
      style={{ borderColor: 'var(--gold-soft)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(59, 130, 246, 0.14) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <p className="section-label section-label-blue mb-4">Last Call</p>
        <h2 className="font-display text-5xl md:text-6xl gold-gradient mb-6">
          Not on the list yet?
        </h2>
        <p className="text-text-dim mb-10 text-lg">
          Drop your name, a photo, and pick your nights. We&#39;ll send you a magic link so you
          can come back and tweak anytime.
        </p>
        <a
          href="/signup"
          className="rsvp-chip px-10 py-4 rounded-full uppercase text-sm tracking-widest inline-block"
        >
          Create My Profile
        </a>
      </div>
    </section>
  );
}
