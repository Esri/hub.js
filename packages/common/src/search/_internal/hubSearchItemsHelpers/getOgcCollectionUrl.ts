import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";

/**
 * @private
 *
 * Given a query, returns the correct OGC Collection URL to target.
 * If a collectionId is indicated, that collection is targeted. Else
 * the all collection is targeted.
 *
 * @param query the query the request is based on
 * @param options request options, including the base OGC api url
 * @returns the collection url
 */
export function getOgcCollectionUrl(query: IQuery, options: IHubSearchOptions) {
  const apiDefinition = options.api as IApiDefinition;
  const collectionId = query.wellKnownCollectionId;
  return collectionId
    ? `${apiDefinition.url}/collections/${collectionId}`
    : `${apiDefinition.url}/collections/all`;
}
