-- Custom map: when set, only these ISO2 country codes are shown on the map. Null = show all (world).
ALTER TABLE maps
ADD COLUMN IF NOT EXISTS custom_map_countries jsonb;

COMMENT ON COLUMN maps.custom_map_countries IS 'Optional array of ISO2 country codes to show. When null, the full world map is shown. When set, only these countries are visible.';
