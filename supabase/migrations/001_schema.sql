-- Vegas Hype Site — Database Schema
-- Run this in your Supabase dashboard → SQL Editor

-- ===== MEMBERS =====
CREATE TABLE IF NOT EXISTS members (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 text UNIQUE NOT NULL,
  name                  text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  photo_url             text,
  bio                   text,
  known_for             text,
  fun_fact              text,
  obsession             text,
  tshirt_size           text,
  plus_one_member_id    uuid REFERENCES members(id) ON DELETE SET NULL,
  is_admin              boolean NOT NULL DEFAULT false,
  is_referee            boolean NOT NULL DEFAULT false,
  trip_rsvp             text CHECK (trip_rsvp IN ('yes', 'no')) DEFAULT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ===== EVENTS =====
CREATE TABLE IF NOT EXISTS events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  additional_info text,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz,
  location        text,
  pricing_tiers   jsonb,   -- [{min,max,perPerson}]; null = hosted/no cost shown
  is_featured     boolean NOT NULL DEFAULT false,
  display_order   int,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ===== RSVPS =====
CREATE TABLE IF NOT EXISTS rsvps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  event_id    uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status      text NOT NULL CHECK (status IN ('attending', 'maybe', 'not_attending')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(member_id, event_id)
);

-- ===== SCAVENGER TASKS =====
CREATE TABLE IF NOT EXISTS scavenger_tasks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank            text NOT NULL CHECK (rank IN ('A','K','Q','J','10','9','8','7','6','5','4','3','2')),
  suit            text NOT NULL CHECK (suit IN ('diamonds','clubs','hearts','spades')),
  title           text NOT NULL,
  description     text NOT NULL,
  points          int NOT NULL,
  notes           text,
  display_order   int,
  is_claimed      boolean NOT NULL DEFAULT false,
  claimed_by      text,
  UNIQUE(rank, suit)
);

-- ===== SITE SETTINGS =====
CREATE TABLE IF NOT EXISTS site_settings (
  key                 text PRIMARY KEY,
  value_text          text,
  value_timestamptz   timestamptz,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ===== SITE LINKS =====
CREATE TABLE IF NOT EXISTS site_links (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description     text,
  url             text,
  icon            text NOT NULL DEFAULT 'link' CHECK (icon IN ('drive','chat','money','calendar','link')),
  display_order   int NOT NULL DEFAULT 0,
  is_visible      boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS events_starts_at_idx         ON events(starts_at);
CREATE INDEX IF NOT EXISTS events_display_order_idx     ON events(display_order);
CREATE INDEX IF NOT EXISTS rsvps_member_id_idx          ON rsvps(member_id);
CREATE INDEX IF NOT EXISTS rsvps_event_id_idx           ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS site_links_display_order_idx ON site_links(display_order);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps          ENABLE ROW LEVEL SECURITY;
ALTER TABLE scavenger_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_links     ENABLE ROW LEVEL SECURITY;

-- Public read (URL being semi-private is the primary security for this ~30-person private event)
CREATE POLICY "Public read members"        ON members         FOR SELECT USING (true);
CREATE POLICY "Public read events"         ON events          FOR SELECT USING (true);
CREATE POLICY "Public read rsvps"          ON rsvps           FOR SELECT USING (true);
CREATE POLICY "Public read tasks"          ON scavenger_tasks FOR SELECT USING (true);
CREATE POLICY "Public read settings"       ON site_settings   FOR SELECT USING (true);
CREATE POLICY "Public read visible links"  ON site_links      FOR SELECT USING (is_visible = true);

-- Public insert for member signup and RSVP (auth gating happens at app level via is_admin)
CREATE POLICY "Public insert members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update members" ON members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public insert rsvps"   ON rsvps   FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update rsvps"   ON rsvps   FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete rsvps"   ON rsvps   FOR DELETE USING (true);
