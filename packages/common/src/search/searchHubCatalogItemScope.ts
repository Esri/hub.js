import { IItem } from "@esri/arcgis-rest-portal";
import {
  IHubCatalog,
  IHubSearchOptions,
  IHubSearchResponse,
  IQuery,
} from "./types";
import { combineQueries } from "./combineQueries";
import { portalSearchItemsAsItems } from "./_internal/portalSearchItems";

/**
 * Helper function to streamline the MapViewer and other applications searching
 * for items in a Catalog. This ONLY searches the item scope of the catalog.
 * It does not search collections or other targetEntity scopes.
 * @param catalog
 * @param query
 * @param options
 * @returns
 */
export function searchHubCatalogItemScope(
  catalog: IHubCatalog,
  query: string | IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IItem>> {
  // get the item scope from the catalog
  const itemScopeQuery = catalog.scopes?.item;
  if (!itemScopeQuery) {
    return Promise.reject(
      new Error("Catalog does not define an item scope for querying.")
    );
  }

  // construct the query object
  if (typeof query === "string") {
    query = {
      targetEntity: "item",
      filters: [
        {
          predicates: [{ term: query }],
        },
      ],
    } as IQuery;
  }

  // Merge the item scope into the query
  const mergedQuery = combineQueries([itemScopeQuery, query]);

  return portalSearchItemsAsItems(mergedQuery, options);
}
