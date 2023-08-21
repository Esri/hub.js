import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
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
import { getGroup } from "@esri/arcgis-rest-portal";

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
  const keyMappings: Record<
    keyof IHubSearchOptions | keyof IPredicate,
    keyof ISearchChannels
  > = {
    sortField: "sortBy",
    term: "name",
  };
  // Map any values that originated from ISearchOptions
  // into a correct ISearchChannels value
  const mapValue = (key: keyof ISearchChannels, value: any): string => {
    let _value = value;
    if (key === "sortOrder") {
      _value = value?.toUpperCase();
    } else if (key === "sortBy") {
      _value = {
        created: "createdAt",
        modified: "updatedAt",
        title: null,
      }[value as "created" | "modified" | "title"];
    }
    return _value;
  };
  allowedPaginationProps.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      const { [prop]: key = prop as any } = keyMappings;
      const _key = key as keyof ISearchChannels;
      const value = mapValue(_key, options[prop]);
      if (key && value) {
        paginationProps[_key] = value;
      }
    }
  });
  // Acceptable fields to use as filters
  const filterProps: Record<string, string[]> = {};
  const allowedFilterProps: Array<keyof ISearchChannels> = [
    "access",
    "groups",
    "name",
  ];
  // Find predicates that match acceptable filter fields
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      Object.keys(predicate).forEach((key: any) => {
        const { [key]: _key = key } = keyMappings;
        if (allowedFilterProps.includes(_key)) {
          filterProps[_key] = [...(filterProps[_key] || []), predicate[key]];
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
export const toHubSearchResult = async (
  channelsResponse: IPagedResponse<IChannel>,
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> => {
  const { total, items, nextStart } = channelsResponse;
  // Convert IChannel to IHubSearchResult
  const channelToSearchResult = async (
    channel: IChannel
  ): Promise<IHubSearchResult> => {
    return {
      ...channel,
      id: channel.id,
      name: channel.name,
      createdDate: new Date(channel.createdAt),
      createdDateSource: "channel",
      updatedDate: new Date(channel.updatedAt),
      updatedDateSource: "channel",
      type: "channel",
      access: channel.access,
      family: "channel",
      owner: channel.creator,
      links: {
        // TODO: add links?
        thumbnail: null,
        self: null,
        siteRelative: null,
      },
      includes: {
        // when 'include' requests 'groups' enrichment, get group details
        groups: options.include?.includes("groups")
          ? await Promise.all(
              channel.groups.map(async (groupId) => {
                let group;
                try {
                  group = await getGroup(groupId, options.requestOptions);
                } catch (e) {
                  group = null;
                  /* tslint:disable-next-line: no-console */
                  console.warn(
                    `Cannot fetch group enhancement for id = ${groupId}`,
                    e
                  );
                }
                return group;
              })
            )
          : [],
      },
    };
  };
  return {
    total,
    results: await Promise.all(items.map(channelToSearchResult)),
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
  // Parse into <IHubSearchResponse<IHubSearchResult>>
  return toHubSearchResult(channelsResponse, query, options);
};
