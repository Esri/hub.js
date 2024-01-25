import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { buildCatalog } from "../search/_internal/buildCatalog";
import { getEntityTypeFromType } from "../search/_internal/getEntityTypeFromType";
import { getAssociatedEntitiesQuery } from "./getAssociatedEntitiesQuery";
import { getPendingEntitiesQuery } from "./getPendingEntitiesQuery";
import { getAvailableToRequestEntitiesQuery } from "./getAvailableToRequestEntitiesQuery";
import { getRequestingEntitiesQuery } from "./getRequestingEntitiesQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IHubCatalog, IQuery } from "../search/types";
import {
  IGetWellKnownCatalogOptions,
  WellKnownCatalog,
  WellKnownCollection,
  dotifyString,
  getWellKnownCatalog,
  getWellknownCollection,
} from "../search/wellKnownCatalog";

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
 * There are two primary UI workflows when we consider associations:
 * 1. Viewing associations
 * 2. Forming associations
 *
 * Because associations involve a 2-way agreement between parent
 * and child, when viewing associations, there are 3 gallery states
 * that can be viewed: "associated", "pending", and "requesting"
 * entities. Additionally, when forming associations, we need a
 * picker experience filtered to entities that can still be
 * requested for association.
 *
 * These define the "well-known" association catalogs that this
 * util can return. In turn, these can be passed into the catalog
 * and/or gallery-picker components to render the appropriate
 * UI experience.
 *
 * @param i18nScope - translation scope to be interpolated into the catalog
 * @param catalogName - name of the well-known catalog requested
 * @param entity - primary entity the catalog is being built for
 * @param associationType - type of entity the primary entity wants to view associations for
 * @param context - contextual auth and portal information
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

  if (!isSupported) {
    throw new Error(
      `getWellKnownAssociationsCatalog: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  i18nScope = dotifyString(i18nScope);
  const targetEntity = getEntityTypeFromType(entity.type);

  /** 1. build a collection based on the provided associationType */
  const collections = [
    getWellknownCollection(
      i18nScope,
      targetEntity,
      associationType as WellKnownCollection
    ),
  ];

  /** 2. build a query based on the provided catalogName */
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
      query = getAvailableToRequestEntitiesQuery(entity, associationType);
      break;
  }

  /** 3. build the well-known catalog */
  // if query filters are undefined (e.g. query = null), we assume
  // an empty state, and we need to construct a default query
  // filter that will return no results
  const filters = query?.filters
    ? query.filters
    : [{ predicates: [{ type: ["Code Attachment"] }] }];
  catalog = buildCatalog(
    i18nScope,
    catalogName,
    filters,
    collections,
    targetEntity
  );

  return catalog;
}

/**
 * Specific util for building well-known (My content, Favorites,
 * Organization, and World) association catalogs to populate
 * a gallery picker experience for requesting association.
 *
 * In addition to the normal filters that define these well-known
 * catalogs, we also need to further filter the results to only
 * include entities that can still be requested for association.
 *
 * @param i18nScope - translation scope to be interpolated into the catalog
 * @param entity - primary entity the catalog is being built for
 * @param associationType - type of entity the primary entity wants to view associations for
 * @param context - contextual auth and portal information
 * @returns {IHubCatalog[]}
 */
export const getAvailableToRequestAssociationCatalogs = (
  i18nScope: string,
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
) => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `getAvailableToRequestAssociationCatalogs: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  i18nScope = dotifyString(i18nScope);
  const filters = getAvailableToRequestEntitiesQuery(
    entity,
    associationType
  ).filters;
  const catalogNames: WellKnownCatalog[] = [
    "myContent",
    "favorites",
    "organization",
    "world",
  ];
  return catalogNames.map((name: WellKnownCatalog) => {
    const options: IGetWellKnownCatalogOptions = {
      user: context.currentUser,
      filters,
      collectionNames: [associationType as WellKnownCollection],
    };
    return getWellKnownCatalog(i18nScope, name, "item", options);
  });
};
