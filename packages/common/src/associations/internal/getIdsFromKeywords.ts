import { HubEntity, HubEntityType } from "../../core";
import { getProp } from "../../objects";

/**
 * given a hub entity, this util maps over its typeKeywords,
 * and for each, determines if it is an association typeKeyword
 * by checking whether it has the form ref|<associationType>|<id>.
 * If so, it extracts and returns the id which correspond to the
 * parent entity that this entity is associated with.
 *
 * @param entity - hub entity to extract ids from
 * @param associationType - entity type to extract ids for
 * @returns {string[]}
 */
export const getIdsFromKeywords = (
  entity: HubEntity,
  associationType: HubEntityType
): string[] => {
  return getProp(entity, "typeKeywords").reduce(
    (ids: string[], keyword: string) => {
      if (keyword.startsWith(`ref|${associationType}|`)) {
        const id = keyword.split("|")[2];
        ids.push(id);
      }
      return ids;
    },
    []
  );
};
