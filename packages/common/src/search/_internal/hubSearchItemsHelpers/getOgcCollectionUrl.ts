import { IQuery } from "../../types/IHubCatalog";
import { IApiDefinition } from "../../types/types";

/**
 * @private
 *
 * Given a query, returns the correct OGC Collection URL to target.
 * If a collectionId is indicated, that collection is targeted. Else
 * the all collection is targeted.
 *
 * @param query the query the request is based on
 * @param api definition object for the OGC API to be targeted
 * @returns the collection url
 */
export function getOgcCollectionUrl(query: IQuery, api: IApiDefinition) {
  const collectionId = query.collection || "all";
  return `${api.url}/collections/${collectionId}`;
}
