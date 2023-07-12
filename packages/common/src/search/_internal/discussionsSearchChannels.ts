import { IHubSearchOptions, IHubSearchResponse, IQuery } from "../types";
import { searchChannels } from "../../discussions/api/channels";
import { IChannel } from "../../discussions";
import {
  processSearchParams,
  toHubSearchResult,
} from "./discussionsSearchChannelsHelpers";

/**
 * @private
 * Execute channel search against the Discussions API
 * @param query
 * @param options
 * @returns
 */
export async function discussionsSearchChannels(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IChannel>> {
  // Pull useful info out of query
  const searchOptions = processSearchParams(options, query);
  // Call to searchChannels
  const channelsResponse = await searchChannels(searchOptions);
  // Parse into <IHubSearchResponse<IChannel>>
  return toHubSearchResult(channelsResponse, query, options);
}
