/**
 * Curated list of countries for the phone country picker: no external
 * dependency, so this covers 20 common countries plus "Other" (where the
 * person types their own dial code) rather than every country in the
 * world.
 *
 * `digits` is the expected LOCAL number length range (area code + number,
 * not counting the dial code) used for validation. `mask` selects which
 * formatting function applies in src/utils/phone.js: "BR" and "US" get
 * country-specific grouping; everything else gets the generic one.
 */
export const COUNTRIES = [
  { code: "BR", name: "Brazil", dialCode: "55", digits: [10, 11], mask: "BR" },
  { code: "US", name: "United States", dialCode: "1", digits: [10, 10], mask: "US" },
  { code: "CA", name: "Canada", dialCode: "1", digits: [10, 10], mask: "US" },
  { code: "GB", name: "United Kingdom", dialCode: "44", digits: [10, 10], mask: "GENERIC" },
  { code: "IE", name: "Ireland", dialCode: "353", digits: [9, 9], mask: "GENERIC" },
  { code: "PT", name: "Portugal", dialCode: "351", digits: [9, 9], mask: "GENERIC" },
  { code: "ES", name: "Spain", dialCode: "34", digits: [9, 9], mask: "GENERIC" },
  { code: "FR", name: "France", dialCode: "33", digits: [9, 9], mask: "GENERIC" },
  { code: "DE", name: "Germany", dialCode: "49", digits: [9, 11], mask: "GENERIC" },
  { code: "IT", name: "Italy", dialCode: "39", digits: [9, 10], mask: "GENERIC" },
  { code: "MX", name: "Mexico", dialCode: "52", digits: [10, 10], mask: "GENERIC" },
  { code: "AR", name: "Argentina", dialCode: "54", digits: [10, 11], mask: "GENERIC" },
  { code: "CL", name: "Chile", dialCode: "56", digits: [9, 9], mask: "GENERIC" },
  { code: "CO", name: "Colombia", dialCode: "57", digits: [10, 10], mask: "GENERIC" },
  { code: "JP", name: "Japan", dialCode: "81", digits: [10, 10], mask: "GENERIC" },
  { code: "CN", name: "China", dialCode: "86", digits: [11, 11], mask: "GENERIC" },
  { code: "IN", name: "India", dialCode: "91", digits: [10, 10], mask: "GENERIC" },
  { code: "AU", name: "Australia", dialCode: "61", digits: [9, 9], mask: "GENERIC" },
  { code: "ZA", name: "South Africa", dialCode: "27", digits: [9, 9], mask: "GENERIC" },
  { code: "AE", name: "United Arab Emirates", dialCode: "971", digits: [9, 9], mask: "GENERIC" },
];

/** Shown last in the list; the person types their own dial code. */
export const OTHER_COUNTRY = {
  code: "OTHER",
  name: "Other",
  dialCode: "",
  digits: [6, 12],
  mask: "GENERIC",
};

/** All selectable options, "Other" always last. */
export const COUNTRY_OPTIONS = [...COUNTRIES, OTHER_COUNTRY];

/** Label for a dropdown row: "United States (+1)", or just "Other". */
export function countryLabel(country) {
  return country.dialCode ? `${country.name} (+${country.dialCode})` : country.name;
}

/**
 * Guesses the visitor's country from their browser's language tag (e.g.
 * "pt-BR" -> Brazil). Falls back to the United States when the tag has no
 * region, or the region isn't in our list.
 */
export function detectDefaultCountry(language = navigator.language) {
  const region = String(language ?? "").split("-")[1]?.toUpperCase();
  return (
    COUNTRIES.find((country) => country.code === region) ??
    COUNTRIES.find((country) => country.code === "US")
  );
}

/**
 * Finds a country by its dial code, for validating an already-composed
 * phone value. Falls back to OTHER_COUNTRY's wide digit range when the
 * dial code doesn't match any entry in the curated list (e.g. someone
 * picked "Other" and typed their own code).
 */
export function findCountryByDialCode(dialCode) {
  return COUNTRIES.find((country) => country.dialCode === dialCode) ?? OTHER_COUNTRY;
}
