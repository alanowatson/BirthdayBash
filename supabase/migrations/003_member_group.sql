-- Add crew/group field to members
ALTER TABLE members ADD COLUMN IF NOT EXISTS "group" TEXT CHECK (
  "group" IS NULL OR "group" IN ('high-school', 'arizona', 'nyc', 'dancers', 'vegas-vets')
);

-- Assign members to crews — update the names to match your actual member records:
-- UPDATE members SET "group" = 'high-school' WHERE name IN ('Name 1', 'Name 2');
-- UPDATE members SET "group" = 'arizona'     WHERE name IN ('Name 3', 'Name 4');
-- UPDATE members SET "group" = 'nyc'         WHERE name IN ('Name 5', 'Name 6');
-- UPDATE members SET "group" = 'dancers'     WHERE name IN ('Name 7', 'Name 8');
-- UPDATE members SET "group" = 'vegas-vets'  WHERE name IN ('Name 9', 'Name 10');
