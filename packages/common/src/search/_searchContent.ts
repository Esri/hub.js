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
      if (options.num) {
        so.num = options.num;
      }
      return searchPortal(so, options.siteModel);
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
  siteModel?: IModel
): Promise<IContentSearchResult> {
  return searchItems(searchOptions).then((resp) => {
    let content = resp.results.map(itemToContent);
    if (siteModel) {
      content = content.map((entry) => setContentSiteUrls(entry, siteModel));
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
