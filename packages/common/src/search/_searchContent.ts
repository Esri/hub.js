import {
  expandContentFilter,
  serializeContentFilterForPortal,
  convertPortalResponseToFacets,
} from "./content-utils";

import {
  Filter,
  IHubSearchOptions,
  IContentSearchResult,
  IFacet,
} from "./types";
import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { expandApi, getNextFunction } from "./utils";
import {
  getItemThumbnailUrl,
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

    // DEPRECATION
    if (options.aggregations?.length) {
      // tslint:disable-next-line:no-console
      console.warn(
        `IHubSearchOptions.aggregations is deprecated. Please use .aggFields instead.`
      );
      so.countFields = options.aggregations.join(",");
      so.countSize = options.aggLimit || 10;
    }

    // Aggregations
    if (options.aggFields?.length) {
      so.countFields = options.aggFields.join(",");
      so.countSize = options.aggLimit || 10;
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
        // tslint:disable-next-line
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
    content.thumbnailUrl = getItemThumbnailUrl(content, portalUrl, token);
    return content;
  };

  return searchItems(searchOptions).then((resp) => {
    const hasNext: boolean = resp.nextStart > -1;
    // convert items to IHubContent's
    let content = resp.results.map(itemToContent);
    // if we have a site, add those urls
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
