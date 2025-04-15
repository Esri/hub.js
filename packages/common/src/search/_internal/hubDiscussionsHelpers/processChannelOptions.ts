import {
  ChannelRelation,
  ChannelSort,
  ISearchChannels,
  SortOrder,
} from "../../../discussions/api/types";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

const SORT_FIELD_MAP: Record<string, ChannelSort> = {
  access: ChannelSort.ACCESS,
  created: ChannelSort.CREATED_AT,
  modified: ChannelSort.UPDATED_AT,
  owner: ChannelSort.CREATOR,
};

const SORT_ORDER_MAP: Record<"desc" | "asc", SortOrder> = {
  desc: SortOrder.DESC,
  asc: SortOrder.ASC,
};

/**
 * @private
 * Converts an IHubSearchOptions object into a partial ISearchChannels
 * object of paging & sort parameters
 * @param options An IHubSearchOptions object
 * @returns a partial ISearchChannels object
 */
export function processChannelOptions(
  options: IHubSearchOptions
): Partial<ISearchChannels> {
  const channelOptions: Partial<ISearchChannels> = {
    relations: [ChannelRelation.CHANNEL_ACL],
  };
  if (options.num) {
    channelOptions.num = options.num;
  }
  if (options.start) {
    channelOptions.start = options.start;
  }
  if (options.sortField && SORT_FIELD_MAP[options.sortField]) {
    channelOptions.sortBy = SORT_FIELD_MAP[options.sortField];
  }
  if (options.sortOrder && SORT_ORDER_MAP[options.sortOrder]) {
    channelOptions.sortOrder = SORT_ORDER_MAP[options.sortOrder];
  }
  return channelOptions;
}
