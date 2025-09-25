import { IHubSearchResult } from "../types/IHubSearchResult";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { searchPostsV2 } from "../../discussions/api/posts";
import { IQuery } from "../types/IHubCatalog";
import { ISearchPosts } from "../..";
import { postToSearchResult } from "./hubDiscussionsHelpers/postToSearchResult";
import { processPostFilters } from "./hubDiscussionsHelpers/processPostFilters";
import { processPostOptions } from "./hubDiscussionsHelpers/processPostOptions";

/**
 * Searches for posts based on the provided query and options.
 * @param query The query object for the search
 * @param options The search options including pagination and sorting
 * @returns A promise that resolves to a search response containing search results
 */
export async function hubSearchPosts(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const processedFilters = processPostFilters(query.filters);
  const processedOptions = processPostOptions(options);
  const data: ISearchPosts = {
    ...processedFilters,
    ...processedOptions,
  };
  const { items, nextStart, total } = await searchPostsV2({
    ...options.requestOptions,
    data,
  });
  const results = await Promise.all(
    items.map((post) => postToSearchResult(post))
  );
  const hasNext = nextStart > -1;
  return {
    total,
    results,
    hasNext,
    next: (): Promise<IHubSearchResponse<IHubSearchResult>> => {
      if (!hasNext) {
        throw new Error("No more hub posts for the given query and options");
      }
      return hubSearchPosts(query, {
        ...options,
        start: nextStart,
      });
    },
  };
}
