import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import HubError from "../../HubError";
import { searchChannels } from "../../discussions/api/channels";
import {
  IChannel,
  IPagedResponse,
  ISearchChannels,
  ISearchChannelsParams,
} from "../../discussions";

/**
 * @private
 * Convert hubSearch IHubSearchOptions and IQuery interfaces to a
 * ISearchChannelsParams structure that is needed for the Discussions API
 * searchChannels(searchOptions: ISearchCHannelsParams) function
 * @param {IHubSearchOptions} options
 * @param {IQuery} query
 * @returns ISearchChannelParams
 */
export const processSearchParams = (
  options: IHubSearchOptions,
  query: IQuery
): ISearchChannelsParams => {
  if (!options.requestOptions) {
    throw new HubError(
      "hubSearchChannels",
      "options.requestOptions is required"
    );
  }
  // Array of properties we want to copy over from IHubSeachOptions to ISearchChannels
  const paginationProps: Partial<Record<keyof ISearchChannels, any>> = {};
  const allowedPaginationProps: Array<keyof IHubSearchOptions> = [
    "num",
    "start",
    "sortField",
    "sortOrder",
  ];
  // Map ISearchOptions key to ISearchChannels key
  const mapKey = (key: keyof IHubSearchOptions): keyof ISearchChannels => {
    if (key === "sortField") {
      return "sortBy";
    }
    return key as keyof ISearchChannels;
  };
  // Map any values that originated from ISearchOptions
  // into a correct ISearchChannels value
  const mapValue = (key: keyof ISearchChannels, value: any): string => {
    let _value = value;
    if (key === "sortOrder") {
      _value = value.toUpperCase();
    }
    return _value;
  };
  allowedPaginationProps.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      const key = mapKey(prop);
      const value = mapValue(key, options[prop]);
      paginationProps[key] = value;
    }
  });
  // Acceptable fields to use as filters
  const filterProps: Record<string, any> = {};
  const allowedFilterProps: Array<keyof ISearchChannels> = ["access", "groups"];
  // Find predicates that match acceptable filter fields
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      Object.keys(predicate).forEach((key: any) => {
        if (allowedFilterProps.includes(key)) {
          filterProps[key] = predicate[key];
        }
      });
    });
  });
  // Return as ISearchChannelsParams
  return {
    ...options.requestOptions,
    data: {
      ...paginationProps,
      ...filterProps,
    },
  };
};

/**
 * @private
 * Convert the Discussions API searchChannels response into an
 * IHubSearchResponse necessary for supporting hubSearch results
 * @param {IPagedResponse{IChannel}} channelsResponse
 * @param {IQuery} query
 * @param {IHubSearchOptions} options
 * @returns IHubSearchResponse<IHubSearchResult>
 */
export const toHubSearchResult = (
  channelsResponse: IPagedResponse<IChannel>,
  query: IQuery,
  options: IHubSearchOptions
): IHubSearchResponse<IHubSearchResult> => {
  const { total, items, nextStart } = channelsResponse;
  // Convert IChannel to IHubSearchResult
  const channelToSearchResult = (channel: IChannel): IHubSearchResult => {
    return {
      id: channel.id,
      name: channel.name,
      createdDate: channel.createdAt,
      createdDateSource: "channel",
      updatedDate: channel.updatedAt,
      updatedDateSource: "channel",
      type: "channel",
      access: channel.access,
      family: "channel",
      owner: channel.creator,
      ...channel,
    };
  };
  return {
    total,
    results: items.map(channelToSearchResult),
    hasNext: nextStart > -1,
    next: () => {
      return hubSearchChannels(query, {
        ...options,
        start: nextStart,
      });
    },
  };
};

/**
 * @private
 * Execute channel search against the Discussions API
 * @param query
 * @param options
 * @returns
 */
export const hubSearchChannels = async (
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> => {
  // Pull useful info out of query
  const searchOptions = processSearchParams(options, query);
  // Call to searchChannels
  const channelsResponse = await searchChannels(searchOptions);
  // Parse into <IHubSearchResponse<IChannel>>
  return toHubSearchResult(channelsResponse, query, options);
};
