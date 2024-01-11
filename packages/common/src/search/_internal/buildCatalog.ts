import { EntityType, IFilter, IHubCatalog, IHubCollection } from "../types";

/**
 * Build an IHubCatalog definition JSON object based on a
 * well-known catalog name, scope filters, and collections
 *
 * @param i18nScope - i18n scope for the catalog title
 * @param catalogName - well known catalog name
 * @param filters - filters to build the catalog scope
 * @param collections - collections to include in the catalog
 * @returns {IHubCatalog}
 */
export function buildCatalog(
  i18nScope: string,
  catalogName: string,
  filters: IFilter[],
  collections: IHubCollection[],
  targetEntity: EntityType
): IHubCatalog {
  const scopes = {
    [targetEntity]: {
      targetEntity,
      filters,
    },
  };
  return {
    schemaVersion: 1,
    title: `{{${i18nScope}catalog.${catalogName}:translate}}`,
    scopes,
    collections,
  };
}
