import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

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
export function getOgcCollectionUrl(
  query: IQuery,
  options: IHubSearchOptions
): string {
  const umbrellaDomain = new URL(options.requestOptions.hubApiUrl).hostname;
  return query.targetEntity === "discussionPost"
    ? `https://${umbrellaDomain}/api/search/v2/collections/discussion-post`
    : `https://${umbrellaDomain}/api/search/v1/collections/all`;
}
