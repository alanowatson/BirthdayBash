import { supabaseAdmin } from './supabase/server';

export interface AlbumSummary {
  total_photos:   number;
  total_videos:   number;
  total_items:    number;
  unique_cameras: number;
  earliest_item:  string | null;
  latest_item:    string | null;
  last_synced_at: string | null;
}

export interface CameraRow {
  camera_model:   string;
  camera_make:    string;
  photo_count:    number;
  pct_of_album:   number;
  earliest_photo: string | null;
  latest_photo:   string | null;
}

export async function getAlbumSummary(): Promise<AlbumSummary | null> {
  const { data } = await supabaseAdmin
    .from('album_summary')
    .select('*')
    .single();
  return data as AlbumSummary | null;
}

export async function getCameraLeaderboard(): Promise<CameraRow[]> {
  const { data } = await supabaseAdmin
    .from('camera_summary')
    .select('*')
    .order('photo_count', { ascending: false })
    .limit(15);
  return (data ?? []) as CameraRow[];
}
