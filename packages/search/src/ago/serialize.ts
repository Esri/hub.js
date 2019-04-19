import { ISearchParams } from "./params";
import { createFilters } from "./create-filters";
import { paramSchema } from "./param-schema";

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
  // encode non-filtereable keys first
  const nonFilterableKeys = Object.keys(searchParams).filter(
    name => !isFilterable(name)
  );
  const encodedNonFilters = nonFilterableKeys
    .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
    .join("&");
  // in order to encode filters, first get a filters obj in terms of fn and terms
  const filters = createFilters(searchParams);
  const encodedFilters = encodeFilters(filters);
  return [encodedNonFilters, encodedFilters].join("&");
}

export function isFilterable(field: string) {
  return paramSchema[field] && paramSchema[field].type === "filter";
}

export function encodeFilters(filters: any = {}): string {
  return Object.keys(filters)
    .map(name => {
      const attribute = filters[name];
      const { fn, terms } = attribute;
      // filters that are part of the catalog defenition are OR'd together then anded to the query
      const type = attribute.catalogDefinition ? "catalog" : "filter";
      const key = encodeURIComponent(`${type}[${name}]`);
      const values = terms.map(encodeURIComponent).join(",");
      return fn ? `${key}=${fn}(${values})` : `${key}=${values}`;
    })
    .join("&");
}
