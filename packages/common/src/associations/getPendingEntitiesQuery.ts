import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { getReferencesDoesNotIncludeQuery } from "./internal/getReferencesDoesNotIncludeQuery";
import { getIncludesDoesNotReferenceQuery } from "./internal/getIncludesDoesNotReferenceQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IArcGISContext } from "..";

/**
 * Pending entities represent "outgoing" requests that are
 * awaiting "approval". They imply a one-way "connection"
 * between parent/child.
 *
 * From the parent's perspective:
 * parent: "includes" the child in its association query
 * child: does NOT "reference" the parent via a typeKeyword
 *
 * From the child's perspective:
 * parent: does NOT "include" the child in its association query
 * child: "references" the parent via a typeKeyword of the
 * form ref|<parentType>|<parentID>
 *
 * The following returns a query to view an entity's outgoing
 * requests for association with another entity type
 *
 * @param entity - Hub entity
 * @param associationType - entity type to query for
 * @param context - contextual auth and portal information
 * @returns {IQuery}
 */
export const getPendingEntitiesQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IQuery> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `getPendingEntitiesQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  const associationHierarchy = getAssociationHierarchy(entityType);
  const isParent = associationHierarchy.children.includes(associationType);

  const query = isParent
    ? await getIncludesDoesNotReferenceQuery(
        entity,
        associationType,
        isParent,
        context
      )
    : await getReferencesDoesNotIncludeQuery(
        entity,
        associationType,
        isParent,
        context
      );

  return query;
};
