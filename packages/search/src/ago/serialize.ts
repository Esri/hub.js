import { ISearchParams } from "./params";
import {
  createFilters,
  encodeFilters,
  filterSchema,
  encodeParams
} from "./helpers/filters";

/**
 * ```
 * serialize raw query parameters into hub specific URI encoding
 * Example:
 * Input: { q: 'crime', tags: 'a,b,c', sort: 'name' }
 * Output: 'q=crime&tags=all(a,b,c)&sort=name'
 * ```
 * @export
 * @param {ISearchParams} searchParams
 * @returns {string}
 */
export function serialize(searchParams: ISearchParams): string {
  // 1. handle filterable params like tags, source, hasApi, groupIds since they follow custom logic
  const filters = createFilters(searchParams);
  const encodedFilters = encodeFilters(filters);
  // 2. handle non-filters like q, sort etc which have <string: string> type and also nested types like page, agg.
  // extract non-filterable fields from search params
  const nonFilterKeys = Object.keys(searchParams).filter(
    param => !isFilterable(param)
  );
  const nonFilterSearchParams: any = {};
  nonFilterKeys.forEach(key => {
    nonFilterSearchParams[key] = searchParams[key];
  });
  const encodedNonFilters = encodeParams(nonFilterSearchParams);
  const parts = [];
  // don't include blank strings in the URI encoding
  if (encodedNonFilters) parts.push(encodedNonFilters);
  if (encodedFilters) parts.push(encodedFilters);
  return parts.join("&");
}

export function isFilterable(field: string) {
  return filterSchema[field] && filterSchema[field].type === "filter";
}
