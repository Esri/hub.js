import { IGroup } from "@esri/arcgis-rest-types";
import { HubEntityType } from "../../core";

/**
 * given an array of groups, this util maps over them,
 * and for each, determines if it's an association group
 * by checking if it has a typeKeyword of the form
 * <associationType>|<id>. If so, it extracts and returns
 * the id which corresponds to the parent entity that this
 * association group belongs to
 *
 * @param groups - array of groups
 * @param associationType - entity type to extract ids for
 * @returns {string[]}
 */
export const getIdsFromAssociationGroups = (
  groups: IGroup[],
  associationType: HubEntityType
): string[] => {
  return groups.reduce((ids: string[], group: IGroup) => {
    // 1. determine if the group is an association group
    const associationTypeKeyword = group.typeKeywords.find((keyword: string) =>
      keyword.startsWith(`${associationType}|`)
    );

    // 2. if so, store the parent id from the typeKeyword to return
    if (associationTypeKeyword) {
      const id = associationTypeKeyword.split("|")[1];
      ids.push(id);
    }

    return ids;
  }, []);
};
