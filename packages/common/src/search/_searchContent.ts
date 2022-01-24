import {
  expandContentFilter,
  serializeContentFilterForPortal,
  convertPortalResponseToFacets,
} from "./content-utils";
import {
  Filter,
  IHubSearchOptions,
  IFacet,
  IContentSearchResult,
} from "./types";
import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { expandApi, getNextFunction } from ".";
import {
  cloneObject,
  getContentThumbnailUrl,
  IHubContent,
  ISearchResponse,
  itemToContent,
  setContentSiteUrls,
} from "..";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Search for content via the Portal or Hub API
 * @param filter
 * @param options
 */
export async function _searchContent(
  filter: Filter<"content">,
  options: IHubSearchOptions
): Promise<ISearchResponse<IHubContent>> {
  // expand filter so we can serialize to either api
  const expanded = expandContentFilter(filter);

  // API
  const api = expandApi(options.api || "arcgis");

  let searchPromise;
  // Portal Search
  if (api.type === "arcgis") {
    // serialize for portal
    const so = serializeContentFilterForPortal(expanded);
    // if we have auth, pass it forward
    // otherwise set the portal property
    if (options.authentication) {
      so.authentication = options.authentication;
    } else {
      so.portal = `${api.url}/sharing/rest`;
    }
    // Aggregations
    if (options.aggregations?.length) {
      so.countFields = options.aggregations.join(",");
      so.countSize = 200;
    }
    // copy over various options
    if (options.num) {
      so.num = options.num;
    }
    if (options.sortField) {
      so.sortField = options.sortField;
    }
    if (options.sortOrder) {
      so.sortOrder = options.sortOrder;
    }
    if (options.site) {
      so.site = cloneObject(options.site);
    }
    searchPromise = searchPortal(so);
  } else {
    // Hub API Search
    // TODO: Implement hub api content search
    searchPromise = Promise.resolve({
      total: 0,
      results: [] as IHubContent[],
      facets: [] as IFacet[],
      hasNext: false,
      next: () => {
        Promise.resolve(null);
      },
    } as IContentSearchResult);
  }
  return searchPromise;
}

/**
 * Internal portal search, which then converts items to Content, and
 * if a Site was passed, also sets urls
 *
 * @param searchOptions
 * @param site
 * @returns
 */
function searchPortal(
  searchOptions: ISearchOptions
): Promise<ISearchResponse<IHubContent>> {
  const portalUrl =
    searchOptions.authentication?.portal || searchOptions.portal;
  let token: string;
  if (searchOptions.authentication) {
    const us: UserSession = searchOptions.authentication as UserSession;
    token = us.token;
  }
  const thumbnailify = (content: IHubContent) => {
    content.thumbnailUrl = getContentThumbnailUrl(portalUrl, content, token);
    return content;
  };

  return searchItems(searchOptions).then((resp) => {
    const hasNext: boolean = resp.nextStart > -1;
    let content = resp.results.map(itemToContent);
    if (searchOptions.site) {
      content = content.map((entry) =>
        setContentSiteUrls(entry, searchOptions.site)
      );
    }
    // add thumbnailUrl
    content = content.map(thumbnailify);
    // convert aggregations into facets
    const facets = convertPortalResponseToFacets(resp);
    return {
      total: resp.total,
      results: content,
      facets,
      hasNext,
      next: getNextFunction<IHubContent>(
        searchOptions,
        resp.nextStart,
        resp.total,
        searchPortal
      ),
    };
  });
}
