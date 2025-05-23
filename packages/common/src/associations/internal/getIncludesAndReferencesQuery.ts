import { getItemGroups } from "@esri/arcgis-rest-portal";
import { HubEntity, HubEntityType } from "../../core/types";
import { getTypesFromEntityType } from "../../core/getTypesFromEntityType";
import { getProp } from "../../objects/get-prop";
import { IQuery } from "../../search/types";
import { combineQueries } from "../../search/combineQueries";
import { getTypeWithKeywordQuery } from "./getTypeWithKeywordQuery";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { getTypeByIdsQuery } from "./getTypeByIdsQuery";
import { getTypeFromEntity } from "../../core/getTypeFromEntity";
import { getIdsFromKeywords } from "./getIdsFromKeywords";
import { getIdsFromAssociationGroups } from "./getIdsFromAssociationGroups";

/**
 * builds a query that will return entities that are
 * "included" AND "referenced"
 *
 * @param entity - Hub entity
 * @param associationType - entity type to query for
 * @param isParent - whether the provided Hub entity is the parent in the association relationship
 * @param context - contextual auth and portal information
 * @returns {IQuery}
 */
export const getIncludesAndReferencesQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  isParent: boolean,
  context: IArcGISContext
): Promise<IQuery> => {
  if (isParent) {
    /**
     * 0. exit early if the parent's association group
     * hasn't been created yet - there can be no associations
     */
    if (!getProp(entity, "associations")) {
      return null;
    }

    /**
     * 1. build query that returns child entities WITH a
     * typeKeyword reference to the parent
     */
    const parentType = getTypeFromEntity(entity);
    const referencedQuery = getTypeWithKeywordQuery(
      getTypesFromEntityType(associationType),
      `ref|${parentType}|${entity.id}`
    );

    /** 2. grab the parent's association query */
    const includedQuery = getProp(entity, "associations.rules.query");

    /** 3. combine queries - will remove null/undefined entries */
    return combineQueries([referencedQuery, includedQuery]);
  } else {
    /** 1. fetch the groups a child has been shared with */
    const { admin, member, other } = await getItemGroups(
      entity.id,
      context.requestOptions
    );
    const groupsChildIsSharedWith = [...admin, ...member, ...other];

    /**
     * 2. filter the child's groups down to association groups
     * (by checking if they have a typeKeyword of the form
     * <associationType>|<id>) and extract parent ids
     */
    const parentIdsThatIncludeChild = getIdsFromAssociationGroups(
      groupsChildIsSharedWith,
      associationType
    );

    /**
     * 3. iterate over the child's typeKeywords and grab the parent
     * ids it references (typeKeyword = <associationType>|<id>)
     */
    const parentIdsChildReferences = getIdsFromKeywords(
      entity,
      associationType
    );

    /**
     * 4. filter the parent ids down to those that include
     * the child AND that the child references
     */
    const parentIds = parentIdsThatIncludeChild.filter((id: string) =>
      parentIdsChildReferences.includes(id)
    );

    /** 5. return a query for the filtered parent ids */
    const type = getTypesFromEntityType(associationType);
    return parentIds.length ? getTypeByIdsQuery(type, parentIds) : null;
  }
};
