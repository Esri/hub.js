import {
  channelToSearchResult,
  getChannelGroupIds,
} from "../../../discussions/utils";
import { IGroup, ISearchResult, searchGroups } from "@esri/arcgis-rest-portal";
import { batch } from "../../../utils/batch";
import { splitArrayByLength } from "../../../utils/_array";
import { IChannel } from "../../../discussions/api/types";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * @private
 * Convert an array of Discussions API channel search results into an
 * array of IHubSearchResult objects
 * @param channels An array of IChannel objects
 * @param options an IHubSearchOptions object
 * @returns a promise that resolves an array of IHubSearchResult objects
 */
export async function channelResultsToSearchResults(
  channels: IChannel[],
  options: IHubSearchOptions
): Promise<IHubSearchResult[]> {
  let groupResults: IGroup[] = [];
  if (options.include?.includes("groups")) {
    // we can search for up to 100 channels at a time that can each
    // have up to 100 groups...
    const uniqueGroupIds = channels.reduce(
      (acc, channel) =>
        getChannelGroupIds(channel).reduce(
          (memo, groupId) =>
            memo.includes(groupId) ? memo : [...memo, groupId],
          acc
        ),
      []
    );
    // conduct up to 5 concurrent searches that can request
    // up to 100 ids per search. if less than 101 ids exist,
    // it performs a single search
    const batchResults: Array<ISearchResult<IGroup>> = await batch(
      splitArrayByLength(uniqueGroupIds, 100),
      (groupIds: string[]) =>
        searchGroups({
          q: groupIds.map((id) => `id:${id}`).join(" OR "),
          num: groupIds.length,
          ...options.requestOptions,
        }),
      5
    );
    // reassemble the batch results into a single array
    groupResults = batchResults.reduce<IGroup[]>(
      (acc, batchResult) => [...acc, ...batchResult.results],
      []
    );
  }
  return channels.map((channel) =>
    channelToSearchResult(
      channel,
      options.include?.includes("groups")
        ? getChannelGroupIds(channel).map(
            (groupId) => groupResults.find(({ id }) => id === groupId) || null
          )
        : []
    )
  );
}
