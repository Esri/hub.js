import { IHubSearchOptions, IHubSearchResponse, IQuery } from "../types";
import HubError from "../../HubError";
import { searchChannels } from "../../discussions/api/channels";
import {
  IChannel,
  IPagedResponse,
  ISearchChannels,
  ISearchChannelsParams,
} from "../../discussions";

/**
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
      "discussionsSearchChannels",
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
  // Map IHubSearchOptions field to ISearchChannels field
  const standardizeKeyName = (
    key: keyof IHubSearchOptions
  ): keyof ISearchChannels => {
    if (key === "sortField") {
      return "sortBy";
    }
    return key as keyof ISearchChannels;
  };
  allowedPaginationProps.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      const key = standardizeKeyName(prop);
      paginationProps[key] = options[prop];
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
 * Convert the Discussions API searchChannels response into an
 * IHubSearchResponse necessary for supporting hubSearch results
 * @param {IPagedResponse{IChannel}} channelsResponse
 * @param {IQuery} query
 * @param {IHubSearchOptions} options
 * @returns IHubSearchResponse<IChannel>
 */
export const toHubSearchResult = (
  channelsResponse: IPagedResponse<IChannel>,
  query: IQuery,
  options: IHubSearchOptions
): IHubSearchResponse<IChannel> => {
  const { total, items, nextStart } = channelsResponse;
  return {
    total,
    results: items,
    hasNext: nextStart > -1,
    next: () => {
      return discussionsSearchChannels(query, {
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
export const discussionsSearchChannels = async (
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IChannel>> => {
  // Pull useful info out of query
  const searchOptions = processSearchParams(options, query);
  // Call to searchChannels
  const channelsResponse = await searchChannels(searchOptions);
  // Parse into <IHubSearchResponse<IChannel>>
  return toHubSearchResult(channelsResponse, query, options);
};
