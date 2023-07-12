import { IHubSearchOptions, IHubSearchResponse, IQuery } from "../../types";
import HubError from "../../../HubError";
import {
  IChannel,
  IPagedResponse,
  ISearchChannels,
  ISearchChannelsParams,
} from "../../../discussions";
import { discussionsSearchChannels } from "..";

// Given IHubSearchOptions and IQuery, restructure into ISearchChannelsParams
export function processSearchParams(
  options: IHubSearchOptions,
  query: IQuery
): ISearchChannelsParams {
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
}

// Given an IPagedResponse<IChannel>, return an IHubSearchResponse<IChannel>
export function toHubSearchResult(
  channelsResponse: IPagedResponse<IChannel>,
  query: IQuery,
  options: IHubSearchOptions
): IHubSearchResponse<IChannel> {
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
}
