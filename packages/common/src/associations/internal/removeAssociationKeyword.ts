import { HubEntityType } from "../../core/types";

/**
 * when a child decides it wants to "disconnect" itself from
 * an existing association, the child removes the typeKeyword
 * (ref|<type>|<id>) that "references" the parent
 *
 * @param typeKeywords - the child entity's typeKeywords
 * @param type - the parent entity's type
 * @param id - the parent entity's id
 * @returns {string[]}
 */
export function removeAssociationKeyword(
  typeKeywords: string[],
  type: HubEntityType,
  id: string
): string[] {
  const associationKeyword = `ref|${type}|${id}`;
  const filteredKeywords = typeKeywords.filter(
    (keyword) => keyword !== associationKeyword
  );

  return filteredKeywords;
}
