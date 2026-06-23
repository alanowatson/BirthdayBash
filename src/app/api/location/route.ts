import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token || token !== process.env.LOCATION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { lat?: unknown; lon?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const lat = typeof body.lat === 'number' ? body.lat : null;
  const lon = typeof body.lon === 'number' ? body.lon : null;

  if (lat === null || lon === null) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('location')
    .upsert({ id: 1, lat, lon, updated_at: new Date().toISOString() });

  if (error) {
    console.error('[location] Supabase error:', error.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
