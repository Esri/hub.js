import { HubFamilies, HubFamily } from "../../hub-types";

/**
 * Checks to see if our type is a family expansion,
 * i.e. our type is a key in HubFamilies and it begins with a dollar sign
 *
 * $content, $site, etc.
 * @param key
 * @returns
 */
export function isFamilyExpansionType(key: string): boolean {
  let result = false;
  // if we have a key, the first character of the key is a $, and the key without the $ is in Hub Families
  if (
    key &&
    key.charAt(0) === "$" &&
    HubFamilies.includes(key.slice(1) as HubFamily)
  ) {
    result = true;
  }
  return result;
}
