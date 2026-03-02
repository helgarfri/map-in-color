-- Run this in Supabase: SQL Editor → New query → paste → Run
-- Adds custom_map_countries so "custom select countries" can be saved.

ALTER TABLE maps
ADD COLUMN IF NOT EXISTS custom_map_countries jsonb;

COMMENT ON COLUMN maps.custom_map_countries IS 'Optional array of ISO2 country codes to show. When null, the full world map is shown. When set, only these countries are visible.';
