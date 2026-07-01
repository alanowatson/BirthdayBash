-- Google Photos sync tables and views

create table if not exists photo_media_items (
  id                  uuid primary key default gen_random_uuid(),
  google_id           text unique not null,
  filename            text,
  mime_type           text,
  media_type          text generated always as (
                        case when mime_type like 'video/%' then 'video' else 'photo' end
                      ) stored,
  creation_time       timestamptz,
  width               integer,
  height              integer,
  camera_make         text,
  camera_model        text,
  focal_length        numeric,
  aperture_f_number   numeric,
  iso_equivalent      integer,
  exposure_time       text,
  fps                 numeric,
  description         text,
  base_url            text,
  first_seen_at       timestamptz default now(),
  last_synced_at      timestamptz default now(),
  created_at          timestamptz default now()
);

create index if not exists photo_media_items_camera      on photo_media_items (camera_make, camera_model);
create index if not exists photo_media_items_time        on photo_media_items (creation_time);
create index if not exists photo_media_items_type        on photo_media_items (media_type);
create index if not exists photo_media_items_synced      on photo_media_items (last_synced_at);

create table if not exists photo_sync_log (
  id              uuid primary key default gen_random_uuid(),
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  status          text,
  items_fetched   integer,
  items_upserted  integer,
  items_new       integer,
  error_message   text,
  duration_ms     integer
);

-- RLS
alter table photo_media_items enable row level security;
alter table photo_sync_log    enable row level security;

create policy "public read media items"
  on photo_media_items for select using (true);

create policy "public read sync log"
  on photo_sync_log for select using (true);

-- Views
create or replace view camera_summary as
select
  coalesce(camera_model, 'Unknown') as camera_model,
  coalesce(camera_make,  'Unknown') as camera_make,
  count(*)                          as photo_count,
  round(count(*) * 100.0 / nullif(sum(count(*)) over (), 0), 1) as pct_of_album,
  min(creation_time)                as earliest_photo,
  max(creation_time)                as latest_photo
from photo_media_items
where media_type = 'photo'
group by camera_make, camera_model
order by photo_count desc;

create or replace view album_summary as
select
  count(*) filter (where media_type = 'photo')  as total_photos,
  count(*) filter (where media_type = 'video')  as total_videos,
  count(*)                                       as total_items,
  count(distinct camera_model)                   as unique_cameras,
  min(creation_time)                             as earliest_item,
  max(creation_time)                             as latest_item,
  (
    select completed_at
    from photo_sync_log
    where status = 'success'
    order by completed_at desc
    limit 1
  ) as last_synced_at
from photo_media_items;
