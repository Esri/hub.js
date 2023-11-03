import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getProp, getTypesFromEntityType } from "..";
import { getIdsFromTypekeywords } from "./internal/getIdsFromTypekeywords";
import { getTypeByIdsQuery } from "./internal/getTypeByIdsQuery";
import { negateGroupPredicates } from "../search/_internal/negateGroupPredicates";

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
 * the child does not "identify" with via a typeKeyword
 *
 * @param entity entity requesting association
 * @param associationType type of entity the requesting entity wants to associate with
 * @param context
 * @returns {IQuery}
 */
export const getRequestAssociationQuery = (
  entity: HubEntity,
  associationType: HubEntityType
): IQuery => {
  let query: IQuery;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(associationType);

    if (isParent) {
      query = negateGroupPredicates(
        getProp(entity, "associations.rules.query")
      );
    } else {
      const ids = getIdsFromTypekeywords(entity, associationType);
      const type = getTypesFromEntityType(associationType);

      query = getTypeByIdsQuery(type, ids, true);
    }
  } else {
    throw new Error(
      `getRequestAssociationQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
