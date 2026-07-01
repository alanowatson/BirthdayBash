import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const PHOTOS_API = 'https://photoslibrary.googleapis.com/v1';

async function getAccessToken(): Promise<{ token: string; scope: string }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  return { token: data.access_token, scope: data.scope ?? '' };
}

interface MediaItem {
  id: string;
  filename?: string;
  mimeType?: string;
  description?: string;
  baseUrl?: string;
  mediaMetadata?: {
    creationTime?: string;
    width?: string;
    height?: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
    video?: {
      cameraMake?: string;
      cameraModel?: string;
      fps?: number;
    };
  };
}

async function fetchAllMediaItems(accessToken: string): Promise<MediaItem[]> {
  const albumId = process.env.GOOGLE_PHOTOS_ALBUM_ID;
  if (!albumId) throw new Error('GOOGLE_PHOTOS_ALBUM_ID not set');

  const items: MediaItem[] = [];
  let pageToken: string | null = null;

  do {
    const body: Record<string, unknown> = { albumId, pageSize: 100 };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch(`${PHOTOS_API}/mediaItems:search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Photos API ${res.status}: ${err}`);
    }

    const data = await res.json();
    if (data.mediaItems) items.push(...data.mediaItems);
    pageToken = data.nextPageToken ?? null;
  } while (pageToken);

  return items;
}

function transformItem(item: MediaItem) {
  const meta  = item.mediaMetadata ?? {};
  const photo = meta.photo ?? {};
  const video = meta.video ?? {};

  return {
    google_id:         item.id,
    filename:          item.filename ?? null,
    mime_type:         item.mimeType ?? null,
    description:       item.description ?? null,
    creation_time:     meta.creationTime ?? null,
    width:             meta.width  ? parseInt(meta.width)  : null,
    height:            meta.height ? parseInt(meta.height) : null,
    camera_make:       photo.cameraMake  ?? video.cameraMake  ?? null,
    camera_model:      photo.cameraModel ?? video.cameraModel ?? null,
    focal_length:      photo.focalLength      ?? null,
    aperture_f_number: photo.apertureFNumber  ?? null,
    iso_equivalent:    photo.isoEquivalent    ?? null,
    exposure_time:     photo.exposureTime     ?? null,
    fps:               video.fps             ?? null,
    base_url:          item.baseUrl ?? null,
    last_synced_at:    new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Debug mode: ?debug=1 — returns token info + live Photos API test without syncing
  const debug = new URL(request.url).searchParams.get('debug');
  if (debug) {
    try {
      const { token, scope } = await getAccessToken();
      const [infoRes, albumsRes] = await Promise.all([
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`),
        fetch(`${PHOTOS_API}/albums?pageSize=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [info, albums] = await Promise.all([infoRes.json(), albumsRes.json()]);
      return NextResponse.json({
        scope_from_refresh: scope,
        tokeninfo: info,
        env_refresh_token_prefix: (process.env.GOOGLE_REFRESH_TOKEN ?? '').slice(0, 10),
        env_album_id: process.env.GOOGLE_PHOTOS_ALBUM_ID ?? '(not set)',
        albums_api_status: albumsRes.status,
        albums_response: albums,
      });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  const syncStart = Date.now();

  const { data: logEntry } = await supabaseAdmin
    .from('photo_sync_log')
    .insert({ status: 'running' })
    .select('id')
    .single();
  const logId = logEntry?.id;

  try {
    const { token: accessToken } = await getAccessToken();
    const rawItems    = await fetchAllMediaItems(accessToken);
    const transformed = rawItems.map(transformItem);

    const { count: beforeCount } = await supabaseAdmin
      .from('photo_media_items')
      .select('*', { count: 'exact', head: true });

    const { error } = await supabaseAdmin
      .from('photo_media_items')
      .upsert(transformed, { onConflict: 'google_id', ignoreDuplicates: false });

    if (error) throw error;

    const { count: afterCount } = await supabaseAdmin
      .from('photo_media_items')
      .select('*', { count: 'exact', head: true });

    const itemsNew  = (afterCount ?? 0) - (beforeCount ?? 0);
    const duration  = Date.now() - syncStart;

    await supabaseAdmin
      .from('photo_sync_log')
      .update({
        completed_at:   new Date().toISOString(),
        status:         'success',
        items_fetched:  rawItems.length,
        items_upserted: transformed.length,
        items_new:      itemsNew,
        duration_ms:    duration,
      })
      .eq('id', logId);

    return NextResponse.json({ success: true, items_fetched: rawItems.length, items_new: itemsNew, duration_ms: duration });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Photo sync failed:', message);

    if (logId) {
      await supabaseAdmin
        .from('photo_sync_log')
        .update({
          completed_at:  new Date().toISOString(),
          status:        'failed',
          error_message: message,
          duration_ms:   Date.now() - syncStart,
        })
        .eq('id', logId);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
