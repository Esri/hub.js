import { ISearchParams } from "./params";
import { createFilters } from "./create-filters";
import { paramSchema } from "./param-schema";
import { encodeFilters } from "./helpers/encode-filters";

/**
 * serialize raw query parameters into hub specific URI encoding
 * Example:
 * Input: { q: 'crime', tags: 'a,b,c', sort: 'name' }
 * Output: 'q=crime&tags=all(a,b,c)&sort=name'
 *
 * @export
 * @param {ISearchParams} searchParams
 * @returns {string}
 */
export function serialize(searchParams: ISearchParams): string {
  // 1. handle simple params like non-filters like q, sort etc.
  const encodedNonFilters = Object.keys(searchParams)
    .filter(param => !isFilterable(param))
    .map(param => `${param}=${encodeURIComponent(searchParams[param])}`)
    .join("&");
  // 2. handle other params like tags, source, hasApi, groupIds that can be filtered
  const filters = createFilters(searchParams);
  const encodedFilters = encodeFilters(filters);
  return [encodedNonFilters, encodedFilters].join("&");
}

export function isFilterable(field: string) {
  return paramSchema[field] && paramSchema[field].type === "filter";
}
