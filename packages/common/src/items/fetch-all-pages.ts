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
  limit = -1
): Promise<SearchableType[]> {
  const pageSize = opts.num || MAX_NUM;
  const firstStart = opts.start || 1;

  const promise =
    limit === -1
      ? searchFunc({ ...opts, num: pageSize, start: firstStart })
      : Promise.resolve({
          nextStart: firstStart,
          total: limit,
          results: [],
          num: pageSize
        });

  return promise
    .then(firstResponse => {
      if (firstResponse.nextStart === -1) return [firstResponse];
      const starts = [];
      for (
        let i = firstResponse.nextStart;
        i <= firstResponse.total;
        i += pageSize
      ) {
        starts.push(i);
      }
      const batchSearchFunc = (start: number) =>
        searchFunc({ ...opts, start, num: pageSize });
      return batch(starts, batchSearchFunc).then(responses => [
        firstResponse,
        ...responses
      ]);
    })
    .then(responses => {
      const results = responses.reduce(
        (acc: SearchableType[], response: ISearchResult<SearchableType>) => [
          ...acc,
          ...response.results
        ],
        []
      );

      // discard results beyond the limit if applicable
      const clipLimit = limit === -1 ? results.length : limit;
      return results.slice(0, clipLimit);
    });
}
