import { ISearchParams } from "./params";
import { createFilters, encodeFilters, filterSchema } from "./helpers/filters";

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
  // 1. handle simple params like non-filters like q, sort etc which have <string: string> type.
  const encodedNonFilters = Object.keys(searchParams)
    .filter(
      param => typeof searchParams[param] !== "object" && !isFilterable(param)
    )
    .map(param => `${param}=${encodeURIComponent(searchParams[param])}`)
    .join("&");
  // 2. handle other params like tags, source, hasApi, groupIds that can be filtered
  const filters = createFilters(searchParams);
  const encodedFilters = encodeFilters(filters);
  // 3. handle agg
  const encodedAggParts = [];
  let encodedAgg = "";
  if (searchParams.agg) {
    if (searchParams.agg.fields) {
      encodedAggParts.push(
        `${encodeURIComponent("agg[fields]")}=${encodeURIComponent(
          searchParams.agg.fields
        )}`
      );
    }
    if (searchParams.agg.size) {
      encodedAggParts.push(
        `${encodeURIComponent("agg[size]")}=${encodeURIComponent(
          searchParams.agg.size.toString()
        )}`
      );
    }
    if (searchParams.agg.mode) {
      encodedAggParts.push(
        `${encodeURIComponent("agg[mode]")}=${encodeURIComponent(
          searchParams.agg.mode
        )}`
      );
    }
    encodedAgg = encodedAggParts.join("&");
  }
  return [encodedNonFilters, encodedFilters, encodedAgg].join("&");
}

export function isFilterable(field: string) {
  return filterSchema[field] && filterSchema[field].type === "filter";
}
