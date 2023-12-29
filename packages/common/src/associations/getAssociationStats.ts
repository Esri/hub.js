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

interface IAssociationStats {
  associated: number;
  pending: number;
  requesting: number;
  referenced?: number;
  included?: number;
}

/**
 * get an entity's association stats - # of associated, pending,
 * requesting, included/referenced entities
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

  if (isSupported) {
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
          queries.map((query: IQuery) => {
            return hubSearch(query, {
              requestOptions: context.hubRequestOptions,
            });
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
  } else {
    throw new Error(
      `getAssociationStats: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return stats;
};
