import { IGroup, getItemGroups } from "@esri/arcgis-rest-portal";
import { HubEntity, HubEntityType } from "../../core/types";
import { getTypesFromEntityType } from "../../core/getTypesFromEntityType";
import { getProp } from "../../objects/get-prop";
import { IQuery } from "../../search/types";
import { combineQueries } from "../../search/_internal/combineQueries";
import { getTypeWithKeywordQuery } from "./getTypeWithKeywordQuery";
import { IArcGISContext } from "../../ArcGISContext";
import { getTypeByIdsQuery } from "./getTypeByIdsQuery";
import { getTypeFromEntity } from "../../core/getTypeFromEntity";
import { getIdsFromTypekeywords } from "./getIdsFromTypekeywords";

export const getIncludesAndIdentifiesQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  isParent: boolean,
  context: IArcGISContext
): Promise<IQuery> => {
  if (isParent) {
    /**
     * 1. build query that returns child entities WITH the
     * entity's association typeKeyword
     */
    const parentIdentifier = getTypeFromEntity(entity);
    const identifiedQuery = getTypeWithKeywordQuery(
      getTypesFromEntityType(associationType),
      `${parentIdentifier}|${entity.id}`
    );

    /** 2. get the entity's association query */
    const includedQuery = getProp(entity, "associations.rules.query");

    /** 3. combine queries - will remove null/undefined entries */
    return combineQueries([identifiedQuery, includedQuery]);
  } else {
    /** 1. fetch the groups a child has been shared with */
    const { admin, member, other } = await getItemGroups(
      entity.id,
      context?.requestOptions
    );
    const groupsChildIsSharedWith = [...admin, ...member, ...other];

    /**
     * 2. filter child's groups down to association groups (using
     * typeKeyword = "parentIdentifier|:id") and grab parent ids
     */
    const parentIdentifier = associationType;
    const parentIdsThatIncludeChild = groupsChildIsSharedWith.reduce(
      (ids: string[], group: IGroup) => {
        const associationTypeKeyword = group.typeKeywords.find(
          (keyword: string) => keyword.startsWith(`${parentIdentifier}|`)
        );

        if (associationTypeKeyword) {
          const id = associationTypeKeyword.split("|")[1];
          ids.push(id);
        }

        return ids;
      },
      []
    );

    /**
     * 3. iterate over the child's typeKeywords and grab the parent
     * ids they identify with (typeKeywords = "parentIdentifier|:id")
     */
    const parentIdsChildIdentifiesWith = getIdsFromTypekeywords(
      entity,
      parentIdentifier
    );

    /**
     * 4. filter the parent ids down to those that include
     * the child AND that the child identifies with
     */
    const parentIds = parentIdsThatIncludeChild.filter((id: string) =>
      parentIdsChildIdentifiesWith.includes(id)
    );

    /** 5. return a query for the filtered parent ids */
    const type = getTypesFromEntityType(associationType);
    return getTypeByIdsQuery(type, parentIds);
  }
};
