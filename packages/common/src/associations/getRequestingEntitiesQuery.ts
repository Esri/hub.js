import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { getReferencesDoesNotIncludeQuery } from "./internal/getReferencesDoesNotIncludeQuery";
import { getIncludesDoesNotReferenceQuery } from "./internal/getIncludesDoesNotReferenceQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IArcGISContext } from "..";

/**
 * Requesting entities represent "incoming" requests that are
 * awaiting "approval". They imply a one-way "connection"
 * between parent/child.
 *
 * From the parent's perspective:
 * parent: does NOT "include" the child in its association query
 * child: "references" the parent via a typeKeyword of the
 * form ref|<parentType>|<parentID>
 *
 * From the child's perspective:
 * parent: "includes" the child in its association query
 * child: does NOT "reference" the parent via a typeKeyword
 *
 * The following returns a query to view an entity's incoming
 * requests for association with another entity type
 *
 * @param entity - Hub entity
 * @param associationType - entity type to query for
 * @param context - contextual auth and portal information
 * @returns {IQuery}
 */
export const getRequestingEntitiesQuery = async (
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

    query = isParent
      ? await getReferencesDoesNotIncludeQuery(
          entity,
          associationType,
          isParent,
          context
        )
      : await getIncludesDoesNotReferenceQuery(
          entity,
          associationType,
          isParent,
          context
        );
  } else {
    throw new Error(
      `getRequestingEntitiesQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
