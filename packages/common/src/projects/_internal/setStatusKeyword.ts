import { HubEntityStatus } from "../../types";

/**
 * adds/updates the project status typekeyword and returns
 * a new array of typekeywords
 * @param typeKeywords project's current typekeywords
 * @param status project status
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
