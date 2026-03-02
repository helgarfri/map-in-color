/**
 * Region presets for custom map selection.
 * Each preset is an array of ISO2 country codes. Used by CustomMapModal.
 */

import worldCountries from "../world-countries.json";

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

/** Preset definitions for the custom map modal. "World" = null (no filter). */
export const REGION_PRESETS = [
  { id: "world", label: "World", codes: null },
  { id: "europe", label: "Europe", codes: EUROPE_CODES },
  { id: "northAmerica", label: "North America", codes: NORTH_AMERICA_CODES },
  { id: "southAmerica", label: "South America", codes: SOUTH_AMERICA_CODES },
  { id: "africa", label: "Africa", codes: AFRICA_CODES },
  { id: "asia", label: "Asia", codes: ASIA_CODES },
  { id: "oceania", label: "Oceania", codes: OCEANIA_CODES },
  { id: "latinAmerica", label: "Latin America", codes: LATIN_AMERICA_CODES },
];

/** All countries for the custom map list (code + name). */
export const ALL_COUNTRIES = worldCountries.map((c) => ({ code: c.code, name: c.name }));
