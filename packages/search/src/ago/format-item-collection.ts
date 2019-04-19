import { ISearchResult } from "@esri/arcgis-rest-items";
import { ISearchParams } from "./params";
import { formatItem } from "./format-item";
import { convertAgoPages } from "./ago-response-to-jsonapi-page";

// This function is responsible for formatting results from the AGO API into the JSONAPI collection format
export function agoFormatItemCollection(
  searchResults: ISearchResult,
  facets: any = {},
  params: ISearchParams
) {
  // console.log('In hub.js => formatItemCollection');
  const queryParams = queryParameters(searchResults, params);
  return {
    data: searchResults.results.map(result => {
      return formatItem(result, queryParams.q);
    }),
    meta: {
      query: searchResults.query,
      queryParameters: queryParams,
      stats: {
        aggs: facets,
        count: searchResults.results.length,
        totalCount: searchResults.total
      }
    }
  };
}

function queryParameters(searchResults: ISearchResult, params: ISearchParams) {
  const queryParams: any = {
    page: convertAgoPages(searchResults)
  };
  return Object.assign({}, params, queryParams);
}
