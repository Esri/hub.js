import { HubEntity, HubEntityType } from "../../core";
import { getProp } from "../../objects";

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
