import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { getIdentifiesDoesNotIncludeQuery } from "./internal/getIdentifiesDoesNotIncludeQuery";
import { getIncludesDoesNotIdentifyQuery } from "./internal/getIncludesDoesNotIdentifyQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IArcGISContext } from "..";

/**
 * Requesting entities represent "outgoing" requests that are
 * awaiting "approval". They imply a one-way "connection"
 * between parent/child.
 *
 * From the parent's perspective:
 * parent: does NOT "include" the child in its association query
 * child: "identifies" the parent via a typeKeyword
 *
 * From the child's perspective:
 * parent: "includes" the child in its association query
 * child: does NOT "identify" the parent via a typeKeyword
 *
 * The following returns a query to view an entity's outgoing
 * requests for association with another entity type
 *
 * @param entity Hub entity
 * @param associationType entity type to query for
 * @param context
 * @returns
 */
export const getRequestingEntityQuery = async (
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
      ? await getIdentifiesDoesNotIncludeQuery(
          entity,
          associationType,
          isParent,
          context
        )
      : await getIncludesDoesNotIdentifyQuery(
          entity,
          associationType,
          isParent,
          context
        );
  } else {
    throw new Error(
      `getRequestingEntityQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
