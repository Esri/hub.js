import { ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { ISearchParams } from "./params";
import { formatItem, convertAgoPages } from "./helpers/format";

// This function is responsible for formatting results from the AGO API into the JSONAPI collection format
export function agoFormatItemCollection(
  searchResults: ISearchResult<IItem>,
  facets: any = {},
  params: ISearchParams
) {
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
      },
      page: {
        start: searchResults.start,
        num: searchResults.num,
        nextStart: searchResults.nextStart
      }
    }
  };
}

function queryParameters(
  searchResults: ISearchResult<IItem>,
  params: ISearchParams
) {
  const queryParams: any = {
    page: convertAgoPages(searchResults)
  };
  return Object.assign({}, params, queryParams);
}
