export interface Member {
  id: string;
  email: string;
  name: string;
  slug: string;
  photo_url: string | null;
  bio: string | null;
  known_for: string | null;
  fun_fact: string | null;
  obsession: string | null;
  tshirt_size: string | null;
  plus_one_member_id: string | null;
  is_admin: boolean;
  is_referee: boolean;
  trip_rsvp: 'yes' | 'no' | null;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  min: number;
  max: number;
  perPerson: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  additional_info: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  pricing_tiers: PricingTier[] | null;
  is_featured: boolean;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface Rsvp {
  id: string;
  member_id: string;
  event_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  created_at: string;
  updated_at: string;
}

export type ScavengerRank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
export type ScavengerSuit = 'diamonds' | 'clubs' | 'hearts' | 'spades';

export interface ScavengerTask {
  id: string;
  rank: ScavengerRank;
  suit: ScavengerSuit;
  title: string;
  description: string;
  points: number;
  notes: string | null;
  display_order: number | null;
  is_claimed: boolean;
  claimed_by: string | null;
}

export interface SiteSetting {
  key: string;
  value_text: string | null;
  value_timestamptz: string | null;
  updated_at: string;
}

export type LinkIcon = 'drive' | 'chat' | 'money' | 'calendar' | 'link';

export interface SiteLink {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  icon: LinkIcon;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
