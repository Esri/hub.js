import { HubEntityStatus } from "../../types";

/**
 * adds/updates the initiative status typekeyword and returns
 * a new array of typekeywords
 * @param typeKeywords initiative's current typekeywords
 * @param status initiative status
 */
export function setStatusKeyword(
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
