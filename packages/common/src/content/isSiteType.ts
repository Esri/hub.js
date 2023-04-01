/**
 * Determines whether, given a type and typekeywords, the input is
 * a site item type or not
 * @param type - the type value on the item
 * @param typeKeywords - the typeKeywords on the item
 */

export function isSiteType(type: string, typeKeywords: string[] = []) {
  return (
    type === "Site Application" ||
    type === "Hub Site Application" ||
    (type === "Web Mapping Application" && typeKeywords.includes("hubSite"))
  );
}
