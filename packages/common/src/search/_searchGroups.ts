import { IGroup, ISearchResult } from "@esri/arcgis-rest-portal";
import { Filter, IFacet, IHubSearchOptions } from "./types";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";
import {
  convertPortalResponseToFacets,
  expandApis,
  mergeSearchResults,
} from ".";
import {
  expandGroupFilter,
  serializeGroupFilterForPortal,
} from "./group-utils";
import { UserSession } from "@esri/arcgis-rest-auth";
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
): Promise<ISearchResult<IGroup>> {
  // expand filter so we can serialize to either api
  const expanded = expandGroupFilter(filter);

  // APIs
  if (!options.apis) {
    // default to AGO PROD
    options.apis = ["arcgis"];
  }
  const apis = expandApis(options.apis);
  const so = serializeGroupFilterForPortal(expanded);
  let token = "";
  // if we have auth, pass it forward
  // otherwise set the portal property
  if (options.authentication) {
    so.authentication = options.authentication;
    const us: UserSession = options.authentication as UserSession;
    token = us.token;
  } else {
    so.portal = `${apis[0].url}/sharing/rest`;
  }

  if (options.num) {
    so.num = options.num;
  }

  let portalUrl = "https://www.arcgis.com/sharing/rest";
  if (so.authentication?.portal) {
    portalUrl = so.authentication.portal;
  }

  const thumbnailify = (group: IGroup) => {
    return addThumbnailUrl(portalUrl, group, token);
  };

  return portalGroupSearch(so).then((response) => {
    // upgrade thumbnail url
    response.results = response.results.map(thumbnailify);
    return response;
  });
}

// Need to decide how to handle adding the token is group is not public
function addThumbnailUrl(
  portalUrl: string,
  group: IGroup,
  token?: string
): IGroup {
  if (group.thumbnail) {
    group.thumbnailUrl = `${portalUrl}/community/groups/${group.id}/info/${group.thumbnail}`;
    if (token) {
      group.thumbnailUrl = `${group.thumbnailUrl}?token=${token}`;
    }
  }
  return group;
}
