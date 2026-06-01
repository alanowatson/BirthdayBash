export default function SiteFooter() {
  return (
    <footer className="py-12 px-6 border-t mt-12" style={{ borderColor: 'var(--gold-soft)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="deco-divider mb-8">
          <div className="deco-diamond" />
          <div className="deco-diamond-blue" />
          <div className="deco-diamond" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gold text-xl">◆</span>
            <span className="font-display tracking-widest text-gold">ALAN&#39;S 40TH</span>
          </div>
          <p className="text-text-dim text-xs italic">
            A private invitation. Tell your families you love them.
          </p>
          <p className="text-text-dim text-xs">© 2026 · Alan&#39;s 40th</p>
        </div>
      </div>
    </footer>
  );
}
