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
import { expandApis, mergeSearchResults } from "./utils";
import { IHubContent, IModel, itemToContent, setContentSiteUrls } from "..";

/**
 * Search for content via the Portal or Hub API
 * @param filter
 * @param options
 */
export async function _searchContent(
  filter: Filter<"content">,
  options: IHubSearchOptions
): Promise<IContentSearchResult> {
  // expand filter so we can serialize to either api
  const expanded = expandContentFilter(filter);

  // APIs
  if (!options.apis) {
    // default to AGO PROD
    options.apis = ["arcgis"];
  }
  const apis = expandApis(options.apis);

  // map over the apis, depending on the type we issue the queries
  const searchPromises = apis.map((api) => {
    // Portal Search
    if (api.type === "arcgis") {
      // serialize for portal
      const so = serializeContentFilterForPortal(expanded);
      // pass auth forward
      if (options.authentication) {
        so.authentication = options.authentication;
      }
      // Aggregations
      if (options.aggregations?.length) {
        so.countFields = options.aggregations.join(",");
        so.countSize = 200;
      }
      // copy over various options
      // TODO: Dry this up
      if (options.num) {
        so.num = options.num;
      }
      if (options.sortField) {
        so.sortField = options.sortField;
      }
      if (options.sortOrder) {
        so.sortOrder = options.sortOrder;
      }
      // NOTE: I think we will end up setting
      // the site URL in mergeSearchResults() instead
      // since it applies to both items and datasets
      return searchPortal(so, options.site);
    } else {
      // Hub API Search
      // TODO: Implement hub api content search
      return Promise.resolve({
        total: 0,
        results: [] as IHubContent[],
        facets: [] as IFacet[],
      });
    }
  });
  // wait for results
  const results = await Promise.all(searchPromises);
  // merge and return
  return mergeSearchResults(results);
}

function searchPortal(
  searchOptions: ISearchOptions,
  site?: IModel
): Promise<IContentSearchResult> {
  return searchItems(searchOptions).then((resp) => {
    let content = resp.results.map(itemToContent);
    if (site) {
      content = content.map((entry) => setContentSiteUrls(entry, site));
    }
    // convert aggregations into facets
    const facets = convertPortalResponseToFacets(resp);
    return {
      total: resp.total,
      results: content,
      facets,
    };
  });
}
