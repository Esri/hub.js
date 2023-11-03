import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getIncludesAndIdentifiesQuery } from "./internal/getIncludesAndIdentifiesQuery";
import { IArcGISContext } from "../ArcGISContext";

/**
 * Associated entities are those which have mutually
 * "agreed" to be connected with one another. They
 * require a two-way "connection" between parent/child:
 *
 * parent: "includes" the child in its association query
 * child: "identifies" the parent via a typeKeyword
 *
 * The following returns a query to view an entity's
 * associations with another entity type
 *
 * @param entity Hub entity
 * @param associationType entity type to query for
 * @param context
 * @returns {IQuery}
 */
export const getAssociatedEntitiesQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IQuery> => {
  let query: IQuery;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(associationType);

    query = await getIncludesAndIdentifiesQuery(
      entity,
      associationType,
      isParent,
      context
    );
  } else {
    throw new Error(
      `getAssociatedEntitiesQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
