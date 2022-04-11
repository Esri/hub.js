import { IGroup, ISearchOptions } from "@esri/arcgis-rest-portal";
import { Filter, IHubSearchOptions } from "./types/types";
import { IFacet } from "./types/IFacet";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";
import { expandApi, getNextFunction } from ".";
import {
  expandGroupFilter,
  serializeGroupFilterForPortal,
} from "./group-utils";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getGroupThumbnailUrl, ISearchResponse } from "..";
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

    // Array of properties we want to copy from IHubSearchOptions
    // to the ISearchOptions
    const props: Array<keyof IHubSearchOptions> = [
      "authentication",
      "num",
      "sortField",
      "sortOrder",
      "site",
      "start",
    ];
    // copy the props over
    props.forEach((prop) => {
      if (options.hasOwnProperty(prop)) {
        so[prop as keyof ISearchOptions] = options[prop];
      }
    });
    // If we don't have auth, ensure we have .portal
    if (!so.authentication) {
      so.portal = `${api.url}/sharing/rest`;
    }

    return searchPortalGroups(so);
  } else {
    throw new Error("_searchGroups is not implemented for non-arcgis apis");
  }
}

/**
 * Internal function that searches for groups using the ArcGIS Portal API
 * @param searchOptions
 * @returns
 */
function searchPortalGroups(
  searchOptions: ISearchOptions
): Promise<ISearchResponse<IGroup>> {
  const teamLinkify = (group: IGroup) => {
    group.siteTeamUrl = `${searchOptions.site.item.url}/teams/${group.id}/about`;
    return group;
  };

  const portalUrl =
    searchOptions.authentication?.portal || searchOptions.portal;
  let token: string;
  if (searchOptions.authentication) {
    const us: UserSession = searchOptions.authentication as UserSession;
    token = us.token;
  }

  const thumbnailify = (group: IGroup) => {
    group.thumbnailUrl = getGroupThumbnailUrl(portalUrl, group, token);
    return group;
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
