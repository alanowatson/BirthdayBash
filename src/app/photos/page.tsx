import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import { getAlbumSummary, getCameraLeaderboard } from '@/lib/photos';

export const revalidate = 3600; // re-fetch at most once per hour

function fmt(dt: string | null) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
}

function fmtDate(dt: string | null) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
}

export default async function PhotosPage() {
  const [summary, cameras] = await Promise.all([
    getAlbumSummary(),
    getCameraLeaderboard(),
  ]);

  const hasData = summary && (summary.total_items ?? 0) > 0;

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-1 px-6 py-24">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-16">
            <p className="section-label mb-4">The Album</p>
            <h1 className="font-display text-5xl md:text-6xl gold-gradient mb-3">Who&#39;s Shooting?</h1>
            <p className="text-text-dim max-w-md mx-auto">
              {hasData
                ? `${summary.total_photos.toLocaleString()} photos and ${summary.total_videos} videos from the shared album.`
                : 'No photos yet — check back during the trip.'}
            </p>
            {summary?.last_synced_at && (
              <p className="text-text-dim text-xs mt-2">
                Last synced {fmt(summary.last_synced_at)} PDT
              </p>
            )}
          </div>

          {!hasData && (
            <div
              className="event-card border border-gold-soft rounded-xl p-10 text-center"
            >
              <p className="text-4xl mb-4">📷</p>
              <p className="font-display text-xl text-gold mb-2">Album is empty</p>
              <p className="text-text-dim text-sm">
                Once you set up the Google Photos shared album and the daily sync runs,
                the leaderboard will appear here automatically.
              </p>
            </div>
          )}

          {hasData && (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Photos',   value: summary.total_photos.toLocaleString() },
                  { label: 'Videos',   value: summary.total_videos.toLocaleString() },
                  { label: 'Cameras',  value: summary.unique_cameras.toString() },
                  { label: 'First shot', value: fmtDate(summary.earliest_item) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="event-card border border-gold-soft rounded-xl p-5 text-center"
                  >
                    <p className="font-display text-2xl text-gold">{value}</p>
                    <p className="text-xs text-text-dim uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Camera leaderboard */}
              <div className="event-card border border-gold-soft rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--gold-soft)' }}>
                  <p className="font-display text-xl text-gold">Camera Leaderboard</p>
                  <p className="text-xs text-text-dim mt-1">
                    Google Photos doesn&apos;t reveal who uploaded each photo —
                    camera model is the closest proxy for the shooter.
                  </p>
                </div>

                <div className="divide-y" style={{ '--divide-color': 'var(--gold-soft)' } as React.CSSProperties}>
                  {cameras.map((row, i) => (
                    <div key={row.camera_model} className="flex items-center gap-4 px-6 py-4">
                      <span
                        className="font-display text-2xl w-8 text-center flex-shrink-0"
                        style={{ color: i === 0 ? 'var(--gold)' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-dim)' }}
                      >
                        {i + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{row.camera_model}</p>
                        <p className="text-xs text-text-dim">{row.camera_make}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-gold">{row.photo_count.toLocaleString()} photos</p>
                        <p className="text-xs text-text-dim">{row.pct_of_album}% of album</p>
                      </div>

                      {/* Bar */}
                      <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.pct_of_album}%`,
                            background: i === 0 ? 'var(--gold)' : 'rgba(212,175,55,0.4)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-text-dim text-xs mt-6">
                Synced daily at 6 AM MST from the shared Google Photos album.
              </p>
            </>
          )}

        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
