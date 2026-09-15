-- Add crew/group field to members (array — one person can belong to multiple crews)
ALTER TABLE members ADD COLUMN IF NOT EXISTS "group" TEXT[];

-- Assign members to crews — update names to match your actual member records.
-- Single crew:   ARRAY['high-school']
-- Multi-crew:    ARRAY['arizona', 'dancers']
--
-- UPDATE members SET "group" = ARRAY['high-school'] WHERE name IN ('Name 1', 'Name 2');
-- UPDATE members SET "group" = ARRAY['arizona']     WHERE name IN ('Name 3', 'Name 4');
-- UPDATE members SET "group" = ARRAY['nyc']         WHERE name IN ('Name 5', 'Name 6');
-- UPDATE members SET "group" = ARRAY['dancers']     WHERE name IN ('Name 7', 'Name 8');
-- UPDATE members SET "group" = ARRAY['vegas-vets']  WHERE name IN ('Name 9', 'Name 10');
-- Multi-group example:
-- UPDATE members SET "group" = ARRAY['high-school', 'dancers'] WHERE name = 'Name 11';
