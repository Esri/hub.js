import { UserSession } from "@esri/arcgis-rest-auth";
import { IGroup, ISearchOptions } from "@esri/arcgis-rest-portal";
import {
  expandGroupFilter,
  mergeGroupFilters,
  serializeGroupFilterForPortal,
} from "./group-utils";
import {
  Filter,
  IFilterBlock,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
} from "./types";
import { expandApi, getGroupThumbnailUrl, getNextFunction } from "./utils";
import { searchGroups as portalGroupSearch } from "@esri/arcgis-rest-portal";

export function hubSearchGroups(
  filters: IFilterBlock<"group">[],
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // API
  const api = expandApi(options.api || "arcgis");

  if (api.type === "arcgis") {
    const filter = mergeGroupFilters(filters);
    const expanded = expandGroupFilter(filter);
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

function groupToSearchResult(group: IGroup): Promise<IHubSearchResult> {
  const result: IHubSearchResult = {
    id: group.id,
    type: "Group",
    name: group.title,
    owner: group.owner,
    summary: group.snippet || group.description,
    createdDate: new Date(group.created),
    createdDateSource: "group",
    updatedDate: new Date(group.modified),
    updatedDateSource: "group",
    thumbnailUrl: group.thumbnailUrl,
    metadata: [],
    hubType: "group",
    family: "Group",
  };

  // Unclear if we'd use pipelines to
  return Promise.resolve(result);
}

/**
 * Internal function that searches for groups using the ArcGIS Portal API
 * @param searchOptions
 * @returns
 */
async function searchPortalGroups(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
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
  const response = await portalGroupSearch(searchOptions);
  const hasNext: boolean = response.nextStart > -1;

  // upgrade thumbnail url
  let results = response.results.map(thumbnailify);
  // generate the site team url if site url is provided
  if (searchOptions.site?.item?.url) {
    results = response.results.map(teamLinkify);
  }

  const hubResults = await Promise.all(results.map(groupToSearchResult));

  return {
    hasNext,
    total: response.total,
    results: hubResults,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      response.nextStart,
      response.total,
      searchPortalGroups
    ),
  };
}
