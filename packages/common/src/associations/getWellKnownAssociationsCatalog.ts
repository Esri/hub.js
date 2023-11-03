import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getProp } from "../objects";
import {
  IHubCatalog,
  IQuery,
  WellKnownCollection,
  dotifyString,
  getWellknownCollection,
} from "../search";
import { buildCatalog } from "../search/_internal/buildCatalog";
import { getEntityTypeFromType } from "../search/_internal/getEntityTypeFromType";
import { getAssociatedEntitiesQuery } from "./getAssociatedEntitiesQuery";
import { getPendingEntitiesQuery } from "./getPendingEntitiesQuery";
import { getRequestAssociationQuery } from "./getRequestAssociationQuery";
import { getRequestingEntitiesQuery } from "./getRequestingEntitiesQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";

/**
 * Supported association catalogs that can be requested.
 * These correspond to a specific IHubCatalog definition
 * that gets returned.
 */
export type WellKnownAssociationCatalog =
  | "associated"
  | "pending"
  | "requesting"
  | "availableToRequest";

/**
 * build a well-known association catalog
 *
 * @param i18nScope translation scope to be interpolated into the catalog
 * @param catalogName name of the well-known catalog requested
 * @param entity primary entity the catalog is being built for
 * @param associationType type of entity the primary entity wants to view associations for
 * @param context
 * @returns {IHubCatalog}
 */
export async function getWellKnownAssociationsCatalog(
  i18nScope: string,
  catalogName: WellKnownAssociationCatalog,
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IHubCatalog> {
  let catalog: IHubCatalog;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    i18nScope = dotifyString(i18nScope);
    const targetEntity = getEntityTypeFromType(entity.type);
    const collections = [
      getWellknownCollection(
        i18nScope,
        targetEntity,
        associationType as WellKnownCollection
      ),
    ];

    let query: IQuery;
    switch (catalogName) {
      case "associated":
        query = await getAssociatedEntitiesQuery(
          entity,
          associationType,
          context
        );
        break;
      case "pending":
        query = await getPendingEntitiesQuery(entity, associationType, context);
        break;
      case "requesting":
        query = await getRequestingEntitiesQuery(
          entity,
          associationType,
          context
        );
        break;
      case "availableToRequest":
        query = getRequestAssociationQuery(entity, associationType);
        break;
    }

    const predicates = getProp(query, "filters[0].predicates");
    catalog = buildCatalog(
      i18nScope,
      catalogName,
      predicates,
      collections,
      targetEntity
    );
  } else {
    throw new Error(
      `getWellKnownAssociationsCatalog: Association between ${entityType} and ${associationType} is not supported.`
    );
  }
  return catalog;
}
