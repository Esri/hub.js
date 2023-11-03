import { IGroup } from "@esri/arcgis-rest-types";
import { HubEntityType } from "../../core";

export const getIdsFromAssociationGroups = (
  groups: IGroup[],
  associationIdentifier: HubEntityType
): string[] => {
  return groups.reduce((ids: string[], group: IGroup) => {
    const associationTypeKeyword = group.typeKeywords.find((keyword: string) =>
      keyword.startsWith(`${associationIdentifier}|`)
    );

    if (associationTypeKeyword) {
      const id = associationTypeKeyword.split("|")[1];
      ids.push(id);
    }

    return ids;
  }, []);
};
