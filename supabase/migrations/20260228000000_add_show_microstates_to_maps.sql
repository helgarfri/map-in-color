-- Add show_microstates to maps table (map settings: when false, microstates are hidden on the world map)
ALTER TABLE maps
ADD COLUMN IF NOT EXISTS show_microstates boolean DEFAULT true;

COMMENT ON COLUMN maps.show_microstates IS 'When false, very small countries (e.g. Monaco, Vatican City) are hidden on the world map. Default true.';

-- Custom microstate selection: when set, only these ISO2 codes are shown (when show_microstates is true). Null = show all.
ALTER TABLE maps
ADD COLUMN IF NOT EXISTS microstates_custom jsonb;

COMMENT ON COLUMN maps.microstates_custom IS 'Optional array of ISO2 codes to show when using custom microstate selection. When null/empty and show_microstates is true, all microstates are shown.';
