const normalizeStateCode = (code) => String(code || "").trim().toLowerCase();

/**
 * Returns a US state/DC flag URL from a state abbreviation (e.g. "CA", "NY", "DC").
 */
export function getUsStateFlagUrl(code, width = 40) {
  const stateCode = normalizeStateCode(code);
  if (!stateCode) return "";
  return `https://flagcdn.com/w${width}/us-${stateCode}.png`;
}

