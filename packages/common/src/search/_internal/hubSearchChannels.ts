import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import HubError from "../../HubError";
import { searchChannels } from "../../discussions/api/channels";
import { processChannelFilters } from "./hubDiscussionsHelpers/processChannelFilters";
import { processChannelOptions } from "./hubDiscussionsHelpers/processChannelOptions";
import { channelResultsToSearchResults } from "./hubDiscussionsHelpers/channelResultsToSearchResults";

/**
 * @private
 * Executes a Discussions API channel search and resolves an IHubSearchResponse<IHubSearchResult> for the channel results
 * @param query an IQuery object
 * @param options an IHubSearchOptions object
 * @returns a promise that resolves an HubSearchResponse<IHubSearchResult> object
 */
export const hubSearchChannels = async (
  query: IQuery,
  searchOptions: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> => {
  if (!searchOptions.requestOptions) {
    throw new HubError(
      "hubSearchChannels",
      "options.requestOptions is required"
    );
  }
  const filters = processChannelFilters(query.filters);
  const options = processChannelOptions(searchOptions);
  const { total, nextStart, items } = await searchChannels({
    data: {
      ...filters,
      ...options,
    },
    ...searchOptions.requestOptions,
  });
  const results = await channelResultsToSearchResults(items, searchOptions);
  return {
    total,
    results,
    hasNext: nextStart > -1,
    next: () =>
      hubSearchChannels(query, {
        ...searchOptions,
        start: nextStart,
      }),
  };
};
