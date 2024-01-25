import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { HubEntity, HubEntityType } from "../core/types";
import { IQuery } from "../search/types";
import { hubSearch } from "../search/hubSearch";
import { getAssociatedEntitiesQuery } from "./getAssociatedEntitiesQuery";
import { getPendingEntitiesQuery } from "./getPendingEntitiesQuery";
import { getRequestingEntitiesQuery } from "./getRequestingEntitiesQuery";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IAssociationStats } from "./types";

/**
 * get Entity A's association stats with Entity B:
 *
 * 1. associated: the number of Entity B's that Entity A
 * is associated with
 *
 * 2. pending: the number of outgoing requests Entity A
 * has sent to Entity B
 *
 * 3. requesting: the number of incoming requests Entity A
 * has received from Entity B
 *
 * 4a. included: if Entity A is the parent, the number of
 * Entity B's it has included in its association group
 *
 * 4b. referenced: if Entity A is the child, the number of
 * Entity B's it has referenced (via typeKeyword)
 *
 * @param entity - Hub entity
 * @param associationType - entity type to query for
 * @param context - contextual auth and portal information
 * @returns
 */
export const getAssociationStats = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IAssociationStats> => {
  let stats: IAssociationStats;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `getAssociationStats: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  const associationHierarchy = getAssociationHierarchy(entityType);
  const isParent = associationHierarchy.children.includes(associationType);

  stats = {
    associated: 0,
    pending: 0,
    requesting: 0,
    ...(isParent ? { included: 0 } : { referenced: 0 }),
  };

  try {
    const queries = await Promise.all([
      getAssociatedEntitiesQuery(entity, associationType, context),
      getPendingEntitiesQuery(entity, associationType, context),
      getRequestingEntitiesQuery(entity, associationType, context),
    ]);

    const [{ total: associated }, { total: pending }, { total: requesting }] =
      await Promise.all(
        queries.map(async (query: IQuery) => {
          try {
            const result = await hubSearch(query, {
              requestOptions: context.hubRequestOptions,
            });
            return result;
          } catch (error) {
            return { total: 0 };
          }
        })
      );

    stats = {
      associated,
      pending,
      requesting,
      ...(isParent
        ? { included: associated + pending }
        : { referenced: associated + pending }),
    };
  } catch (error) {
    return stats;
  }

  return stats;
};
