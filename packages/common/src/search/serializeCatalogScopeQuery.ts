import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { EntityType, IHubCatalog } from "./types/IHubCatalog";
import { upgradeCatalogSchema } from "./upgradeCatalogSchema";
import { expandPortalQuery } from "./utils";
import { serializeQueryForPortal } from "./serializeQueryForPortal";

/**
 * Serialize the catalog scope into search options.
 * This is explicitly exported for other ArcGIS platform
 * applications that need to work with Hub Catalogs.
 * @param catalog The catalog to serialize
 * @param scope The scope to serialize
 * @returns The serialized search options
 */
export function serializeCatalogScope(
  catalog: IHubCatalog,
  scope: EntityType
): ISearchOptions {
  // apply any catalog schema migrations
  const upgraded = upgradeCatalogSchema(catalog);
  // get the scope
  const scopeQuery = upgraded.scopes[scope];
  if (!scopeQuery) {
    throw new Error(`No query found for scope: ${scope}`);
  }
  // apply any expansions
  const updatedQuery = expandPortalQuery(scopeQuery);
  // Serialize into a structure compatible with the portal search
  return serializeQueryForPortal(updatedQuery);
}
