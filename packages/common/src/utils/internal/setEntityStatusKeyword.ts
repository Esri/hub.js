import { HubEntityStatus } from "../../types";

/**
 * adds/updates the entity status typekeyword and returns
 * a new array of typekeywords
 * @param typeKeywords entity's current typekeywords
 * @param status entity status
 */
export function setEntityStatusKeyword(
  typeKeywords: string[],
  status: HubEntityStatus
): string[] {
  // filter out the existing status typekeyword
  const filteredTypekeywords = typeKeywords.filter((typekeyword: string) => {
    return !typekeyword.startsWith("status|");
  });

  // add the new/updated status typekeyword
  filteredTypekeywords.push(`status|${status}`);
  return filteredTypekeywords;
}
