import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getIncludesAndReferencesQuery } from "./internal/getIncludesAndReferencesQuery";
import { IArcGISContext } from "../ArcGISContext";

/**
 * Associated entities are those which have mutually
 * "agreed" to be connected with one another. They
 * require a two-way "connection" between parent/child:
 *
 * parent: "includes" the child in its association query
 * child: "references" the parent via a typeKeyword of
 * the form ref|<parentType>|<parentID>
 *
 * The following returns a query to view an entity's
 * associations with another entity type
 *
 * @param entity - Hub entity
 * @param associationType - entity type to query for
 * @param context - contextual auth and portal information
 * @returns {IQuery}
 */
export const getAssociatedEntitiesQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IQuery> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `getAssociatedEntitiesQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  const associationHierarchy = getAssociationHierarchy(entityType);
  const isParent = associationHierarchy.children.includes(associationType);

  const query = await getIncludesAndReferencesQuery(
    entity,
    associationType,
    isParent,
    context
  );

  return query;
};
