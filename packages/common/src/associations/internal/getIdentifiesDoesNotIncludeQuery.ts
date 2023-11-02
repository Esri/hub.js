import { IGroup, getItemGroups } from "@esri/arcgis-rest-portal";
import { HubEntity, HubEntityType } from "../../core/types";
import { getTypesFromEntityType } from "../../core/getTypesFromEntityType";
import { getProp } from "../../objects/get-prop";
import { IQuery } from "../../search/types";
import { combineQueries } from "../../search/_internal/combineQueries";
import { getTypeWithKeywordQuery } from "./getTypeWithKeywordQuery";
import { negateGroupPredicates } from "../../search/_internal/negateGroupPredicates";
import { IArcGISContext } from "../../ArcGISContext";
import { getTypeByIdsQuery } from "./getTypeByIdsQuery";
import { getTypeFromEntity } from "../../core/getTypeFromEntity";

export const getIdentifiesDoesNotIncludeQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  isParent: boolean,
  context: IArcGISContext
): Promise<IQuery> => {
  if (isParent) {
    /**
     * 1. build query that returns child entities WITH the
     * parent's association typeKeyword
     */
    const parentIdentifier = getTypeFromEntity(entity);
    const identifiedQuery = getTypeWithKeywordQuery(
      getTypesFromEntityType(associationType),
      `${parentIdentifier}|${entity.id}`
    );

    /** 2. get the parent's association query */
    const includedQuery = getProp(entity, "associations.rules.query");

    /**
     * 3. negate the predicates in the association query + combine
     * queries - will remove null/undefined entries
     *
     * TODO: in the future, we will need a function to negate all
     * predicates in the association query - for now, the query
     * only specifies an association group, so this will work
     */
    return combineQueries([
      identifiedQuery,
      negateGroupPredicates(includedQuery),
    ]);
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
    const parentIdsChildIdentifiesWith = getProp(entity, "typeKeywords").reduce(
      (ids: string[], keyword: string) => {
        if (keyword.startsWith(`${parentIdentifier}|`)) {
          const id = keyword.split("|")[1];
          ids.push(id);
        }
        return ids;
      },
      []
    );

    /**
     * 4. filter the parent ids down to those that the child
     * identifies with but that the parent does NOT include
     */
    const parentIds = parentIdsChildIdentifiesWith.filter(
      (id: string) => !parentIdsThatIncludeChild.includes(id)
    );

    /** 5. return a query for the filtered parent ids */
    return getTypeByIdsQuery(associationType, parentIds);
  }
};
