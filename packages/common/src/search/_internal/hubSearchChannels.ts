import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import HubError from "../../HubError";
import { searchChannelsV2 } from "../../discussions/api/channels";
import { processChannelFilters } from "./hubDiscussionsHelpers/processChannelFilters";
import { processChannelOptions } from "./hubDiscussionsHelpers/processChannelOptions";
import { channelResultsToSearchResults } from "./hubDiscussionsHelpers/channelResultsToSearchResults";

/**
 * @private
 * Executes a Discussions API channel search and resolves an IHubSearchResponse<IHubSearchResult> for the channel results
 * Currently supported filters include:
 *   - term: string;
 *   - group: string | string[];
 *   - access: 'public' | 'private' | 'org' | Array<'public' | 'org' | 'private'>
 *   - id: string | string[] | { not: string } | { not: string[] };
 *   - orgId: string;
 *   - hasUserPosts: boolean;
 *   - discussion: string;
 *   - owner: string;
 *   - createdDateRange: IDateRange<string | number>;
 *   - updatedDateRange: IDateRange<string | number>;
 *   - role: 'read' | 'write' | 'readWrite' | 'moderate' | 'manage' | 'owner' | Array<'read' | 'write' | 'readWrite' | 'moderate' | 'manage' | 'owner'>
 * Currently supported sort fields include:
 *   - created
 *   - modified
 *   - owner
 *   - lastActivity
 * @param query an IQuery object
 * @param options an IHubSearchOptions object
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult> object
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
  const { total, nextStart, items } = await searchChannelsV2({
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
    next: (): Promise<IHubSearchResponse<IHubSearchResult>> =>
      hubSearchChannels(query, {
        ...searchOptions,
        start: nextStart,
      }),
  };
};
