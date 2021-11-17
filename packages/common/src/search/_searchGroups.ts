import { IGroup, ISearchOptions } from "@esri/arcgis-rest-portal";
import { Filter, IFacet, IHubSearchOptions } from "./types";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";
import { expandApi, getNextFunction } from ".";
import {
  expandGroupFilter,
  serializeGroupFilterForPortal,
} from "./group-utils";
import { UserSession } from "@esri/arcgis-rest-auth";
import { cloneObject, ISearchResponse } from "..";
export interface IGroupSearchResult {
  groups: IGroup[];
  facets: IFacet[];
}

/**
 * Search Groups using Filter<"group">
 *
 * Currently just returns ISearchResult<IGroup>
 * @param filter
 * @param options
 * @returns
 */
export async function _searchGroups(
  filter: Filter<"group">,
  options: IHubSearchOptions
): Promise<ISearchResponse<IGroup>> {
  // expand filter so we can serialize to either api
  const expanded = expandGroupFilter(filter);

  // API
  const api = expandApi(options.api || "arcgis");

  if (api.type === "arcgis") {
    const so = serializeGroupFilterForPortal(expanded);
    let token = "";
    // if we have auth, pass it forward
    // otherwise set the portal property
    if (options.authentication) {
      so.authentication = options.authentication;
      const us: UserSession = options.authentication as UserSession;
      token = us.token;
    } else {
      so.portal = `${api.url}/sharing/rest`;
    }

    if (options.num) {
      so.num = options.num;
    }

    let portalUrl = `${api.url}/sharing/rest`;
    if (so.authentication?.portal) {
      portalUrl = so.authentication.portal;
    }

    if (options.site) {
      so.site = cloneObject(options.site);
    }

    return searchPortalGroups(so);
  } else {
    throw new Error("_searchGroups is not implemented for non-arcgis apis");
  }
}

function searchPortalGroups(
  searchOptions: ISearchOptions
): Promise<ISearchResponse<IGroup>> {
  const teamLinkify = (group: IGroup) => {
    group.siteTeamUrl = `${searchOptions.site.item.url}/teams/${group.id}/about`;
    return group;
  };

  const portalUrl =
    searchOptions.authentication?.portal ||
    "https://www.arcgis.com/sharing/rest";
  let token: string;
  if (searchOptions.authentication) {
    const us: UserSession = searchOptions.authentication as UserSession;
    token = us.token;
  }
  // Partially apply url and token to addThumbnailUrl fn
  const thumbnailify = (group: IGroup) => {
    return addThumbnailUrl(portalUrl, group, token);
  };

  // execute the search
  return portalGroupSearch(searchOptions).then((response) => {
    const hasNext: boolean = response.nextStart > -1;

    // upgrade thumbnail url
    let results = response.results.map(thumbnailify);
    // generate the site team url if site url is provided
    if (searchOptions.site?.item?.url) {
      results = response.results.map(teamLinkify);
    }

    return {
      hasNext,
      total: response.total,
      results,
      next: getNextFunction<IGroup>(
        searchOptions,
        response.nextStart,
        response.total,
        searchPortalGroups
      ),
    } as ISearchResponse<IGroup>;
  });
}

/**
 * Internal helper that adds  `thumbnailUrl` property to an `IGroup`
 * if the `.thumbnail` property is defined.
 * Will add a token if group is not public and a token is passed in
 * @param portalUrl
 * @param group
 * @param token
 * @returns
 */
function addThumbnailUrl(
  portalUrl: string,
  group: IGroup,
  token?: string
): IGroup {
  if (group.thumbnail) {
    group.thumbnailUrl = `${portalUrl}/community/groups/${group.id}/info/${group.thumbnail}`;
    if (token && group.access !== "public") {
      group.thumbnailUrl = `${group.thumbnailUrl}?token=${token}`;
    }
  }
  return group;
}
