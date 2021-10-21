import { IHubContent } from "..";
import { Filter, FilterType, ISearchOptions } from "./types";

/**
 * Search for content
 * @param filter
 * @param options
 */
export function _searchContent(
  filter: Filter<FilterType>,
  options: ISearchOptions
): IHubContent[] {
  throw new Error("Not Implemented");
}
