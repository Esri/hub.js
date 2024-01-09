import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getProp } from "../objects/get-prop";
import { getTypesFromEntityType } from "../core/getTypesFromEntityType";
import { getIdsFromKeywords } from "./internal/getIdsFromKeywords";
import { getTypeByNotIdsQuery } from "./internal/getTypeByNotIdsQuery";
import { negateGroupPredicates } from "../search/_internal/negateGroupPredicates";
import { getTypeByIdsQuery } from "./internal/getTypeByIdsQuery";
import { combineQueries } from "../search/_internal/combineQueries";

/**
 * An entity can send an "outgoing" request to associate
 * itself with another entity. The following query returns
 * a set of entities that the requesting entity can still
 * request:
 *
 * from a parent perspective: returns a set of children
 * that are NOT "included" in the parent's association group
 *
 * from a child perspective: returns a set of parents that
 * the child does not "reference" with via a typeKeyword of
 * the form ref|<parentType>|<parentID>
 *
 * @param entity - entity requesting association
 * @param associationType - type of entity the requesting entity wants to associate with
 * @param context - contextual auth and portal information
 * @returns {IQuery}
 */
export const getAvailableToRequestEntitiesQuery = (
  entity: HubEntity,
  associationType: HubEntityType
): IQuery => {
  let query: IQuery;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `getAvailableToRequestEntitiesQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  const associationHierarchy = getAssociationHierarchy(entityType);
  const isParent = associationHierarchy.children.includes(associationType);

  if (isParent) {
    /** 1. build query that returns child entities */
    const childType = getTypesFromEntityType(associationType);
    const childTypeQuery = getTypeByIdsQuery(childType, []);

    /**
     * 2. grab the parent's association query and negate
     * the group predicate
     */
    const notIncludedQuery = negateGroupPredicates(
      getProp(entity, "associations.rules.query")
    );

    /** 3. combine queries - will remove null/undefined entries */
    query = combineQueries([notIncludedQuery, childTypeQuery]);
  } else {
    /**
     * 1. iterate over the child's typeKeywords and grab the parent
     * ids it references (typeKeyword = <associationType>|<id>)
     */
    const ids = getIdsFromKeywords(entity, associationType);

    /**
     * 2. build query that returns parent entities NOT
     * "referenced" by the child
     */
    const type = getTypesFromEntityType(associationType);
    query = getTypeByNotIdsQuery(type, ids);
  }

  return query;
};
