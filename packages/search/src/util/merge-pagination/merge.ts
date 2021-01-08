import { encode } from "base-64";
import { InvalidPaginationInputError } from "./invalid-pagination-input";

/**
 * Interface that describes the name of a datasource (label) and the next start
 * at which to search pages of data
 */
interface IDataPageNextStart {
  label: string;
  nextPageStart?: number;
}

/**
 * When multiple data sources underly a paginated search, the search implementation should be able to
 * search at the appropriate starting point for each source for a given paged set of results. This
 * function merges an array of page states for each source, denoted by their label, into a base64-
 * encoded cursor string that the implementation can use for the next set of results.
 *
 * @param pages an array of page states denoted by their label and the starting point for the next page
 * @returns a base64-encoded cursor string to use when obtaining next page of results.
 *
 */
export function mergePages(pages: IDataPageNextStart[]): string {
  if (!pages || !Array.isArray(pages)) {
    throw new InvalidPaginationInputError(
      `Invalid Input Error. Must be array of IDataPageNextStart, received: ${JSON.stringify(
        pages
      )}`,
      pages
    );
  }

  const mergedPages: Record<string, number> = pages.reduce(
    (pageObj: Record<string, number>, page: IDataPageNextStart) => {
      pageObj[page.label] = page.nextPageStart || 1;
      return pageObj;
    },
    {} as Record<string, number>
  );

  return encode(JSON.stringify(mergedPages));
}
