import { ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import { SearchableType, SearchFunction } from "../types";
import { batch } from "../utils/batch";

const MAX_NUM = 100;

/**
 * Fetches all the pages
 * @param opts search options
 */
export function fetchAllPages(
  searchFunc: SearchFunction,
  opts: ISearchOptions,
  pageSize = MAX_NUM
): Promise<SearchableType[]> {
  return searchFunc({ ...opts, num: 1 })
    .then(({ total }) => {
      const starts = [];
      for (let i = 1; i <= total; i += pageSize) starts.push(i);
      const batchSearchFunc = (start: number) =>
        searchFunc({ ...opts, start, num: pageSize });
      return batch(starts, batchSearchFunc);
    })
    .then(responses => {
      return responses.reduce(
        (acc: SearchableType[], response: ISearchResult<SearchableType>) => [
          ...acc,
          ...response.results
        ],
        []
      );
    });
}
