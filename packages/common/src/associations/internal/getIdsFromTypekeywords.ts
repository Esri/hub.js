import { HubEntity, HubEntityType } from "../../core";
import { getProp } from "../../objects";

/**
 * helper to extract ids from association typeKeywords
 *
 * @param entity Hub entity
 * @param associationType association identifier that typeKeywords start with
 * @returns {string[]}
 */
export const getIdsFromTypekeywords = (
  entity: HubEntity,
  associationType: HubEntityType
): string[] => {
  return getProp(entity, "typeKeywords").reduce(
    (ids: string[], keyword: string) => {
      if (keyword.startsWith(`${associationType}|`)) {
        const id = keyword.split("|")[1];
        ids.push(id);
      }
      return ids;
    },
    []
  );
};
