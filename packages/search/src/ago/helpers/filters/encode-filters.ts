export function encodeFilters(filters: any = {}): string {
  return Object.keys(filters)
    .map(name => {
      const attribute = filters[name];
      const { fn, terms } = attribute;
      // filters that are part of the catalog definition are OR'd together then and-ed to the query
      const type = attribute.catalogDefinition ? "catalog" : "filter";
      const key = encodeURIComponent(`${type}[${name}]`);
      const values = terms.map(encodeURIComponent).join(",");
      return fn ? `${key}=${fn}(${values})` : `${key}=${values}`;
    })
    .join("&");
}
