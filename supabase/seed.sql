-- Vegas Hype Site — Seed Data
-- Run this AFTER 001_schema.sql in your Supabase dashboard → SQL Editor

-- ===== EVENTS =====
-- All times stored in UTC; displayed in PT (America/Los_Angeles, PDT = UTC-7 in October)

INSERT INTO events (title, slug, description, starts_at, ends_at, location, pricing_tiers, is_featured, display_order) VALUES

-- THURSDAY Oct 22 — Early arrivals
('Thursday Night Hangout',
 'thursday-hangout',
 'No agenda — just whoever''s already in town. Alan''s available after 6pm. Find him, find a bar.',
 '2026-10-23 01:00:00+00',   -- Oct 22, 6:00 PM PDT
 NULL,
 'TBD — Downtown or Strip',
 '[]'::jsonb,   -- own drinks, no host structure
 false, 10),

-- FRIDAY Oct 23
('Friday Dayclub',
 'friday-dayclub',
 'Pool party to kick things off. Noon to 5pm. Venue TBD — expect a table or daybed expense. Dress code: upscale swimwear only. Men: swim trunks — no basketball shorts, cargo shorts, or jean shorts. Women: bikinis, one-pieces, or stylish cover-ups. Cover up while walking through the casino to get to the pool. Bags: small clutches are OK and will be searched; backpacks and large bags must be checked at the bell desk.',
 '2026-10-23 19:00:00+00',   -- Oct 23, 12:00 PM PDT
 '2026-10-24 00:00:00+00',   -- Oct 23,  5:00 PM PDT
 'TBD',
 '[]'::jsonb,
 true, 20),

('Fremont Street Crawl',
 'fremont-street-crawl',
 'Classic Vegas. Bar-hop down Fremont — the light show, the zip line, the dive bars, the chaos. ~9pm arrival.',
 '2026-10-24 04:00:00+00',   -- Oct 23, 9:00 PM PDT
 NULL,
 'Fremont Street · Downtown Las Vegas',
 NULL,
 false, 30),

-- SATURDAY Oct 24
('Saturday Dayclub',
 'saturday-dayclub',
 'Round two. Noon to 5pm. Venue TBD — expect a table or daybed expense. Same rules as Friday: upscale swimwear only. Men: swim trunks — no basketball shorts, cargo shorts, or jean shorts. Women: bikinis, one-pieces, or stylish cover-ups. Cover up through the casino. Bags: small clutches OK and will be searched; backpacks and large bags must be checked.',
 '2026-10-24 19:00:00+00',   -- Oct 24, 12:00 PM PDT
 '2026-10-25 00:00:00+00',   -- Oct 24,  5:00 PM PDT
 'TBD',
 '[]'::jsonb,
 true, 40),

('Saturday Nightclub',
 'saturday-nightclub',
 'The big night. Meetup at 10:15pm sharp — club arrival around 11:15pm. Venue TBD. Expect an expense — everyone should be there. Dress code: smart-casual to dressed up. Men: collared or fitted dress shirt, dark jeans or dress pants, dress shoes or clean solid-color sneakers — no athletic wear, shorts, hats, or work boots. Women: dresses, jumpsuits, dressy separates, heels. Bags: small clutches only — backpacks and large bags not allowed inside.',
 '2026-10-25 05:15:00+00',   -- Oct 24, 10:15 PM PDT
 NULL,
 'TBD',
 NULL,
 true, 50),

-- SUNDAY Oct 25
('Stadium Swim',
 'stadium-swim',
 'Six pools, one giant 143-foot screen. Sun, frozen drinks, and whatever game is on. Meetup at noon. Bring SPF and stamina.',
 '2026-10-25 19:00:00+00',   -- Oct 25, 12:00 PM PDT
 NULL,
 'Circa Resort & Casino · Stadium Swim',
 '[]'::jsonb,
 false, 60),

('Sunday Dinner',
 'sunday-dinner',
 'Low-key farewell dinner for whoever''s still standing. TBD based on who''s around — Alan and Kate hit the road Monday at noon.',
 '2026-10-26 02:00:00+00',   -- Oct 25, 7:00 PM PDT
 NULL,
 'TBD',
 NULL,
 false, 70);


-- ===== SCAVENGER TASKS (all 52) =====
-- Points: A=14 down to 3=3. 2s are penalty cards at -2 pts.

INSERT INTO scavenger_tasks (rank, suit, title, description, points, display_order) VALUES

-- ACES (14 pts)
('A', 'diamonds', 'Private Jet Flex',
 'Get a photo inside a vehicle you definitely can''t afford (Ferrari/Lambo/luxury car, helicopter, private jet — 747 doesn''t count). Must be sitting in driver''s seat or cockpit.',
 14, 10),

('A', 'clubs', 'These Aren''t the Droids You''re Looking For',
 'Convince someone that you''re press/influencer and get them to comp you something (club cover, pool entry, bottle upgrade, etc.).',
 14, 20),

('A', 'hearts', 'Active Camo',
 'Sneak/finesse your way into the DJ area. Closest to the DJ wins.',
 14, 30),

('A', 'spades', 'Loot Goblin',
 'Get invited to someone else''s cabana/daybed/table and take a drink from their setup.',
 14, 40),

-- KINGS (13 pts)
('K', 'diamonds', 'Environmental Kill',
 'Push someone who hasn''t been in the pool... into the pool at your hotel (ejection risk accepted).',
 13, 50),

('K', 'clubs', 'Care Package',
 'Get a round of 3+ shots comped for the group or yourself.',
 13, 60),

('K', 'hearts', 'Longest Road',
 'Lose the most money gambling. (Un-stealable, follows the player)',
 13, 70),

('K', 'spades', 'Sugar Rush',
 'Get someone of the opposite gender older than you to buy you a drink. Sugar Mommas should appear to be in their late 40s+. Sugar Daddies must be late 50s+.',
 13, 80),

-- QUEENS (12 pts)
('Q', 'diamonds', 'That''s No Moon',
 'Photobomb a stranger with required exposure (nipple for ladies, ball/shaft for fellas).',
 12, 90),

('Q', 'clubs', 'Minneapolis Miracle',
 'WIN a sports bet on any Minnesota, New York or Arizona sports team. Card goes to the biggest profiteer.',
 12, 100),

('Q', 'hearts', 'Tea Bagging',
 'Photobomb a stranger with required exposure (nipple for ladies, ball/shaft for fellas).',
 12, 110),

('Q', 'spades', 'It''s a Trap!',
 'Find a slot machine that reminds you of Alan and hit a bonus (Chinese slots are not allowed, Japanese are). Bonus buys not eligible — must trigger naturally. Photo/video required.',
 12, 120),

-- JACKS (11 pts)
('J', 'diamonds', 'The Suns of Tatooine',
 'Stay up till sunrise from a night out.',
 11, 130),

('J', 'clubs', 'Papa/Mama-Razzi',
 'Upload the most photos of the weekend to the shared album by Sunday morning.',
 11, 140),

('J', 'hearts', 'Double Jump',
 'Visit 2 separate strip clubs in one night.',
 11, 150),

('J', 'spades', 'Did We Just Become Best Friends?',
 'Awarded to the 2 people who: A — didn''t know each other before... and B — post the most ussies together.',
 11, 160),

-- 10s (10 pts)
('10', 'diamonds', 'Flurry Rush',
 'Leverage the El Cortez''s free play into the most profits.',
 10, 170),

('10', 'clubs', 'DJ Request',
 'Successfully get a DJ to play a song you request. Photo/video of song playing required.',
 10, 180),

('10', 'hearts', 'XXX-Wingman',
 'Try to matchmake a stranger and get them to make out with someone they didn''t previously know. Double points if you get them to make out with Jason Ma.',
 10, 190),

('10', 'spades', 'Continue?',
 'Start with $10 bet on any even-money game. If lose, double to $20. If lose again, double to $40. Stop when you win OR lose $40 bet.',
 10, 200),

-- 9s (9 pts)
('9', 'diamonds', 'Pincer Attack A',
 'Eiffel Tower someone at a pool/club. +1 point if both participants didn''t know each other before this weekend.',
 9, 210),

('9', 'clubs', 'Pincer Attack B',
 'Eiffel Tower someone at a pool/club. +1 point if both participants didn''t know each other before this weekend.',
 9, 220),

('9', 'hearts', 'Fault Lines Redux',
 'Find girl(s), not in our group, that can do the splits.',
 9, 230),

('9', 'spades', 'Mei Ult',
 'Find someone (not in our group) that can do a BBoy freeze.',
 9, 240),

-- 8s (8 pts)
('8', 'diamonds', 'Vanilla Unicorn',
 'Make a bet with a stripper. A third party must corroborate.',
 8, 250),

('8', 'clubs', 'Birthday Squad',
 'Find a girls'' birthday trip group AND convince them to sing happy birthday to Alan. Photo required.',
 8, 260),

('8', 'hearts', 'Third Party (Bachelor)',
 'Photo with a bachelor party.',
 8, 270),

('8', 'spades', 'Third Party (Bachelorette)',
 'Photo with a bachelorette party.',
 8, 280),

-- 7s (7 pts)
('7', 'diamonds', 'Sega Genesis',
 'Bet $30 total on Alans birthday numbers, nickels on each number 11, 15, 8, and 6, 4, 0 (11-15-1986).',
 7, 290),

('7', 'clubs', 'Come Out Roll',
 'At a live game of craps, be the shooter.',
 7, 300),

('7', 'hearts', 'Use the Force',
 'Bet Fibonacci sequence on 2:1 roulette bets (columns or dozens). Start $15, must continue (15, 30, 45, 75) until you win OR lose the $75 bet. (15% chance you lose $180, 85% chance you win ~$30)',
 7, 310),

('7', 'spades', 'Birthday Twins',
 'Find someone celebrating their birthday this weekend AND take a photo with them.',
 7, 320),

-- 6s (6 pts)
('6', 'diamonds', 'Patch Notes',
 'In Aria''s depths, a restaurant evolution, the net was cast, but met dissolution. Seek the spot where 2 starts rise, name the before and after to claim the prize. (Find location and post pic)',
 6, 330),

('6', 'clubs', 'Apex Heirloom',
 'Before the strip stole Vegas fame, this neon cowboy built his name. Find the pardner standing tall, most iconic of them all. (Find location and post pic)',
 6, 340),

('6', 'hearts', 'Explosive Payload',
 'In a cosmic kitchen where a chef''s empire grew, the bar Alan''s gut cannot pursue. Where casein reigns and sweet treats flow, eat the compost to prove you know. (Find location and post pic)',
 6, 350),

('6', 'spades', 'Legendary Skin',
 'Awarded to best dressed Saturday Night.',
 6, 360),

-- 5s (5 pts)
('5', 'diamonds', '"It''ll Be Nice Working with Proper Villains Again"',
 'Where waters dance on borrowed time, descend to where they stored each dime. The steel remains, the cash has fled, now liquid gold is poured instead. (Find location and post pic)',
 5, 370),

('5', 'clubs', 'Shifting Sand Land',
 'Where seasons shift on desert sand, and blooms obey a different hand. Find the garden that breaks nature''s law, and capture spring in winter''s thaw. (Find location and post pic)',
 5, 380),

('5', 'hearts', 'Slappers Only',
 'Gamblers dream and Fremont Street gleams, find the art that''s not what it seems. Figures stand without a care, flaunting what most wouldn''t dare. (Find location and post pic)',
 5, 390),

('5', 'spades', 'Overwatch Villains',
 'Where high rollers rest above the fray, a bird of prey marks the way. Seek the lounge where few can go, find the talon''s exclusive show.',
 5, 400),

-- 4s (4 pts)
('4', 'diamonds', 'Great Fairy Fountain',
 'Throw a coin in a fountain and make a wish for Alan. Photo of the toss.',
 4, 410),

('4', 'clubs', 'Tears of the Kingdom',
 'Find the opulent shower of tears, eight thousand pieces through the years. Spanning the floors from 1 and 2, snap a pic from the 1.5 view.',
 4, 420),

('4', 'hearts', 'Project Hail Mary',
 'Find someone at a casino who''s reading a physical book. Photo with them and the book.',
 4, 430),

('4', 'spades', 'The Robber',
 'Covertly steal a card from another player. Confirm steal with Ref.',
 4, 440),

-- 3s (3 pts)
('3', 'diamonds', 'The Greeter',
 'Welcome/greet 10 strangers as they enter a venue ("Welcome to Vegas!", high fives, etc.). Video of at least 5 interactions.',
 3, 450),

('3', 'clubs', 'Overhealth',
 'Award for most non-alcoholic drinks consumed on Day/Night Party day 1.',
 3, 460),

('3', 'hearts', 'Shield Batteries',
 'Award for most non-alcoholic drinks consumed at Saturday Day Club.',
 3, 470),

('3', 'spades', 'Kessel Run',
 'Arrive to any planned event 10+ minutes early. Timestamp proof.',
 3, 480),

-- 2s (-2 pts — penalty cards)
('2', 'diamonds', 'Lagggggg',
 'Negative 2 points to the player who is most late, to the most events.',
 -2, 490),

('2', 'clubs', 'Dysentery',
 'Negative 2 points — first person who pukes.',
 -2, 500),

('2', 'hearts', 'First Blood',
 'Negative 2 points to the person that leaves the earliest Friday Night.',
 -2, 510),

('2', 'spades', 'Knocked One',
 'Negative 2 points to the person that leaves the earliest Saturday Night.',
 -2, 520);


-- ===== SITE SETTINGS =====
-- scavenger_reveal_at: Oct 15, 2026 midnight PDT = Oct 15, 2026 07:00 UTC
INSERT INTO site_settings (key, value_timestamptz, updated_at) VALUES
('scavenger_reveal_at', '2026-10-14 07:00:00+00', now())
ON CONFLICT (key) DO UPDATE SET
  value_timestamptz = EXCLUDED.value_timestamptz,
  updated_at = now();


-- ===== SITE LINKS =====
-- All start with url = NULL (pending state). Admin fills in URLs via /admin/links.
INSERT INTO site_links (title, description, url, icon, display_order, is_visible) VALUES

('Google Photos',
 'Shared album for the weekend. Dump your photos and videos here — also handy for scavenger hunt photo evidence.',
 'https://photos.app.goo.gl/X7LruFJEm6ZmHSvW8',
 'drive',
 10,
 true),

('Signal Group',
 'Live updates, last-minute plans, and the official group chat for photo evidence during the scavenger hunt.',
 'https://signal.group/#CjQKIPajEyLLO00Aj4Zibvz8cI7mQAVxfeQ4Wo2Yrj3_wcPyEhApKl68vko_VbFLOpD8S4jH',
 'chat',
 20,
 true),

('Splitwise',
 'Add the weekend''s shared expenses here (bottle service, cabanas, dinners) so we can settle up clean before everyone flies home.',
 NULL,
 'money',
 30,
 true);
