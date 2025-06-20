import HubError from "../HubError";
import { getProp } from "../objects";
import { cloneObject } from "../util";

import { getApi } from "./_internal/commonHelpers/getApi";
import { portalSearchGroupMembers } from "./_internal/portalSearchGroupMembers";
import { portalSearchItems } from "./_internal/portalSearchItems";
import { portalSearchGroups } from "./_internal/portalSearchGroups";
import {
  searchPortalUsersLegacy,
  searchPortalUsers,
  searchCommunityUsers,
} from "./_internal/portalSearchUsers";
import { hubSearchItems } from "./_internal/hubSearchItems";
import { hubSearchChannels } from "./_internal/hubSearchChannels";
import { hubSearchEvents } from "./_internal/hubSearchEvents";
import { hubSearchEventAttendees } from "./_internal/hubSearchEventAttendees";
import { portalFetchOrgs } from "./_internal/portalFetchOrgs";
import { EntityType, IQuery } from "./types/IHubCatalog";
import { IHubSearchResponse } from "./types/IHubSearchResponse";
import { IHubSearchOptions } from "./types/IHubSearchOptions";
import { IHubSearchResult } from "./types/IHubSearchResult";
import { ApiTarget } from "./types/types";

type HubSearchDelegate = (
  query: IQuery,
  options: IHubSearchOptions
) => Promise<IHubSearchResponse<IHubSearchResult>>;

type HubSearchDelegateMap = Partial<Record<EntityType, HubSearchDelegate>>;

/**
 * Main entrypoint for searching via Hub
 *
 * Default's to search ArcGIS Portal but can delegate
 * to Hub API when it's available.
 * @param query
 * @param options
 * @returns
 */
export async function hubSearch(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Validate inputs
  if (!query) {
    throw new HubError("hubSearch", "Query is required.");
  }

  if (!Array.isArray(query.filters)) {
    throw new HubError("hubSearch", "Query must have a filters array.");
  }

  if (!query.filters.length) {
    throw new HubError("hubSearch", "Query must contain at least one Filter.");
  }

  if (!options.requestOptions) {
    throw new HubError(
      "hubSearch",
      "requestOptions: IHubRequestOptions is required."
    );
  }

  // Ensure includes is an array
  if (!options.include) {
    options.include = [];
  }

  // Get the type of the first filterGroup
  const filterType = query.targetEntity;

  // NOTE: We want to clone the `options` object to do some expansion operations,
  // But if we clone `options.requestOptions`, the underlying `ArcGISIdentityManager` will
  // lose some fundamental functions like `getToken`. As a workaround, we just
  // clone everything else on the `options` object.
  const { requestOptions, ...remainder } = options;
  const formattedOptions: IHubSearchOptions = cloneObject(remainder);
  formattedOptions.requestOptions = requestOptions;

  formattedOptions.api = getApi(filterType, formattedOptions);

  const fnHash: Record<ApiTarget, HubSearchDelegateMap> = {
    portal: {
      item: portalSearchItems,
      group: portalSearchGroups,
      user: searchPortalUsersLegacy,
      portalUser: searchPortalUsers,
      communityUser: searchCommunityUsers,
      groupMember: portalSearchGroupMembers,
      organization: portalFetchOrgs,
    },
    hub: {
      item: hubSearchItems,
      channel: hubSearchChannels,
      discussionPost: hubSearchItems,
      event: hubSearchEvents,
      eventAttendee: hubSearchEventAttendees,
    },
  };

  const fn = getProp(
    fnHash,
    `${formattedOptions.api}.${filterType}`
  ) as HubSearchDelegate;
  if (!fn) {
    throw new HubError(
      `hubSearch`,
      `Search via "${filterType}" filter against "${formattedOptions.api}" api is not implemented. Please ensure "targetEntity" is defined on the query.`
    );
  }
  return fn(cloneObject(query), formattedOptions);
}
