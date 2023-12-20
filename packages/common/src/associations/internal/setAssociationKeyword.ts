import { HubEntityType } from "../../core/types";

/**
 * when a child sends an "outgoing" request or accepts an
 * "incoming" request for association, the child "references"
 * the parent via a typeKeyword (ref|<type>|<id>)
 *
 * @param typeKeywords - the child entity's typeKeywords
 * @param type - the parent entity's type
 * @param id - the parent entity's id
 * @returns {string[]}
 */
export function setAssociationKeyword(
  typeKeywords: string[],
  type: HubEntityType,
  id: string
): string[] {
  const keyword = `ref|${type}|${id}`;
  if (!typeKeywords.includes(keyword)) {
    typeKeywords = [...typeKeywords, keyword];
  }

  return typeKeywords;
}
