import { ISearchResult, IItem } from "@esri/arcgis-rest-portal";
import { ISearchParams } from "./params";
import { formatItem } from "./helpers/format";

// This function is responsible for formatting results from the AGO API into the JSONAPI collection format
export function agoFormatItemCollection(
  searchResults: ISearchResult<IItem>,
  facets: any = {},
  params: ISearchParams
) {
  const queryParams = Object.assign({}, params);
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
