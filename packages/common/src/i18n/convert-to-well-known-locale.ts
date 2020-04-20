import { HUB_LOCALES } from "./hub-locales";

/**
 * Convert a requested locale into a locale we support.
 * i.e. en-ca => en
 * If the requested locale is not available, en will be returned
 * @param {string} requestedLocale Locale we want
 */
export function convertToWellKnownLocale(requestedLocale = "en"): string {
  let wellKnownKey = "en";
  // ensure downcase
  requestedLocale = requestedLocale.toLowerCase();
  // see if it's in the hub translations as-is
  if (HUB_LOCALES.indexOf(requestedLocale) > -1) {
    wellKnownKey = requestedLocale;
  } else {
    // if we split the requested locale, see if we have the root in the list
    const parts = requestedLocale.split("-");
    if (parts.length > 1 && HUB_LOCALES.indexOf(parts[0]) > -1) {
      wellKnownKey = parts[0];
    }
  }
  return wellKnownKey;
}
