/**
 * Region presets for custom map selection.
 * Each preset is an array of ISO2 country codes. Used by CustomMapModal.
 */

import worldCountries from "../world-countries.json";
import { MICROSTATES_LIST } from "./microstates";

// Europe: European nations + European microstates + Turkey (geographically partly in Europe)
export const EUROPE_CODES = [
  "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES",
  "FI", "FO", "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI",
  "LT", "LU", "LV", "MC", "MD", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "SE", "SI", "SK",
  "SM", "TR", "UA", "VA", "XK", "ME", "RS", "SJ",
];

// North America: USA, Canada, Mexico, Greenland, Bermuda, Saint Pierre and Miquelon
export const NORTH_AMERICA_CODES = ["US", "CA", "MX", "GL", "BM", "PM"];

// South America (continental + Falklands)
export const SOUTH_AMERICA_CODES = [
  "AR", "BO", "BR", "CL", "CO", "EC", "GF", "GY", "PY", "PE", "SR", "UY", "VE", "FK",
];

// Central America
export const CENTRAL_AMERICA_CODES = ["BZ", "CR", "GT", "HN", "NI", "PA", "SV"];

// Caribbean (main territories/countries)
export const CARIBBEAN_CODES = [
  "AG", "AI", "AW", "BB", "BL", "BQ", "CU", "CW", "DM", "DO", "GD", "GP", "HT", "JM",
  "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI",
];

// Latin America = Mexico + Central America + South America + Caribbean
export const LATIN_AMERICA_CODES = [
  "MX",
  ...CENTRAL_AMERICA_CODES,
  ...SOUTH_AMERICA_CODES.filter((c) => c !== "FK"),
  ...CARIBBEAN_CODES,
];

// Africa (all UN/ISO African countries and territories – continental + island nations)
export const AFRICA_CODES = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD", "CI",
  "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY",
  "MG", "MW", "ML", "MR", "MU", "YT", "MA", "MZ", "NA", "NE", "NG", "RE", "RW", "SH",
  "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "EH", "ZM", "ZW",
];

// Asia (including Middle East, Central Asia, South/East Asia; excluding Russia/TR if you prefer “Europe” only for them)
export const ASIA_CODES = [
  "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "GE", "IN", "ID", "IR", "IQ",
  "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MO", "MY", "MV", "MN", "MM", "NP",
  "KP", "KR", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "LK", "SY", "TW", "TJ", "TH",
  "TL", "TR", "TM", "AE", "UZ", "VN", "YE", "HK",
];

// Oceania (Australia, New Zealand, Pacific)
export const OCEANIA_CODES = [
  "AU", "NZ", "FJ", "PG", "SB", "VU", "KI", "MH", "FM", "NR", "PW", "GU", "MP", "AS",
  "NC", "PF", "WF", "NU", "CK", "TO", "WS", "TV",
];

/** Map type options for the data/create flow (World, Europe, US States). */
export const MAP_TYPE_OPTIONS = [
  { id: "world", label: "World" },
  { id: "europe", label: "Europe" },
  { id: "usa", label: "US States" },
];

/** Preset definitions for the custom map modal. "World" = null (no filter). Latin America after South America. */
export const REGION_PRESETS = [
  { id: "world", label: "World", codes: null },
  { id: "europe", label: "Europe", codes: EUROPE_CODES },
  { id: "northAmerica", label: "North America", codes: NORTH_AMERICA_CODES },
  { id: "southAmerica", label: "South America", codes: SOUTH_AMERICA_CODES },
  { id: "latinAmerica", label: "Latin America", codes: LATIN_AMERICA_CODES },
  { id: "africa", label: "Africa", codes: AFRICA_CODES },
  { id: "asia", label: "Asia", codes: ASIA_CODES },
  { id: "oceania", label: "Oceania", codes: OCEANIA_CODES },
];

/** Presets shown in CustomMapModal: US States is third (after World, Europe); Latin America after South America. */
export const CUSTOM_MAP_MODAL_PRESETS = [
  REGION_PRESETS[0], // World
  REGION_PRESETS[1], // Europe
  { id: "usa", label: "US States", codes: null, isMapType: true },
  REGION_PRESETS[2], // North America
  REGION_PRESETS[3], // South America
  REGION_PRESETS[4], // Latin America
  REGION_PRESETS[5], // Africa
  REGION_PRESETS[6], // Asia
  REGION_PRESETS[7], // Oceania
];

/** All countries for the custom map list (code + name). */
export const ALL_COUNTRIES = worldCountries.map((c) => ({ code: c.code, name: c.name }));

const norm = (c) => String(c ?? "").toUpperCase().trim();

const MICROSTATE_CODES_SET = new Set(MICROSTATES_LIST.map((m) => norm(m.code)));

function isMicrostateInPreset(code, presetId) {
  const n = norm(code);
  return MICROSTATE_CODES_SET.has(n);
}

function isCountryOnlyInPreset(code, presetId) {
  const n = norm(code);
  return !MICROSTATE_CODES_SET.has(n);
}

/**
 * Infer region preset id from a list of country codes (e.g. from API map data that may not include custom_map_preset_id).
 * Saved custom_map_countries contains only "country" codes (no microstates), so we compare against each preset's country-only codes.
 * Returns preset id when:
 * - the codes set exactly matches a region preset, or
 * - the codes are a non-empty subset of exactly one region preset (keeps continent viewport after removing countries).
 * If subset membership is ambiguous (fits multiple presets), returns null.
 */
export function inferPresetIdFromCodes(codes) {
  if (!Array.isArray(codes) || codes.length === 0) return null;
  const set = new Set(codes.map(norm).filter(Boolean));
  if (set.size === 0) return null;

  const regionPresets = REGION_PRESETS.filter((p) => p.id !== "world" && p.id !== "usa" && p.codes);

  // 1) Exact set match (preferred, deterministic).
  for (const preset of regionPresets) {
    const presetCountryOnly = getCountryOnlyCodesInPreset(preset.id);
    const presetSet = new Set(presetCountryOnly.map(norm));
    if (presetSet.size !== set.size) continue;
    if ([...presetSet].every((c) => set.has(c))) return preset.id;
  }

  // 2) Subset fallback: pick the closest containing preset.
  // Some subsets can belong to multiple presets (e.g. South America subset is also in Latin America).
  // Prefer the smallest containing preset so region-specific views win over broader regions.
  const subsetMatches = [];
  for (const preset of regionPresets) {
    const presetCountryOnly = getCountryOnlyCodesInPreset(preset.id);
    const presetSet = new Set(presetCountryOnly.map(norm));
    if ([...set].every((c) => presetSet.has(c))) {
      subsetMatches.push({ id: preset.id, size: presetSet.size });
    }
  }

  if (subsetMatches.length === 1) return subsetMatches[0].id;
  if (subsetMatches.length > 1) {
    subsetMatches.sort((a, b) => a.size - b.size || a.id.localeCompare(b.id));
    return subsetMatches[0].id;
  }
  return null;
}

/**
 * Return country-only codes for a region preset (preset codes minus microstates).
 * Matches the format saved by CustomMapModal and expected by inferPresetIdFromCodes.
 */
export function getCountryOnlyCodesInPreset(presetId) {
  if (!presetId || presetId === "usa") return [];
  const preset = REGION_PRESETS.find((p) => p.id === presetId);
  if (!preset || !preset.codes) return [];
  return preset.codes.filter((c) => isCountryOnlyInPreset(c, presetId));
}

/**
 * Return microstate codes that belong to a given region preset (intersection of preset codes and MICROSTATES_LIST).
 * Used when loading a saved map: if preset is e.g. Europe and microstates_custom is null, use these so we don't show all 63 world microstates.
 */
export function getMicrostateCodesInPreset(presetId) {
  if (!presetId || presetId === "usa") return [];
  const preset = REGION_PRESETS.find((p) => p.id === presetId);
  if (!preset || !preset.codes) return [];
  return preset.codes.filter((c) => isMicrostateInPreset(c, presetId));
}
