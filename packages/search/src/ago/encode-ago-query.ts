import { getSortField } from "./helpers/sort";
import { createFilters, handleFilter } from "./helpers/filters";
import { createAggs } from "./helpers/aggs";
import { getProp } from "@esri/hub-common";
/**
 * Construct a query object with filters, and queryParams sent by hub indexer
 * @param queryObject any
 */
export function encodeAgoQuery(queryParams: any = {}) {
  const query: any = {
    q: null,
    start: getProp(queryParams, "page.start") || 1,
    num: getProp(queryParams, "page.size") || 10
  };
  // start with 'implicit' query filters
  let queryParts = ['-type:"code attachment"'];
  if (queryParams.restricted) {
    queryParts.push("-access:public");
  }
  // Build the potentially enourmous 'q' parameter. In future use SearchQueryBuilder from arcgis-rest-js
  if (queryParams.q) {
    queryParts.push(queryParams.q);
  }
  if (queryParams.catalog) {
    const filter = createFilters(queryParams.catalog);
    queryParts.push(handleFilter(filter));
  }

  const implicitFilters = createFilters(queryParams);
  // queryParams filter is an obj with key<string>: value<string> where value is serialized as 'all(a,b)'
  // so parse each filter string into fn and terms
  const explicitFilters = createFilters(queryParams.filter);
  const filters = { ...implicitFilters, ...explicitFilters };

  if (Object.keys(filters).length) {
    // add each parsed filter object into ago query
    queryParts.push(handleFilter(filters));
  }
  // cleanse queryParts by removing blank strings
  queryParts = queryParts.filter(qp => !!qp);
  query.q = queryParts.join(" AND ");
  if (queryParams.bbox) {
    query.bbox = queryParams.bbox;
  }
  if (queryParams.sort) {
    const sortOrder = queryParams.sort[0] === "-" ? "desc" : "asc";
    // AGO supports sorting on only 1 field at a time
    let sortField =
      sortOrder === "desc"
        ? queryParams.sort.substring(1).split(",")[0]
        : queryParams.sort.split(",")[0];
    sortField = getSortField(sortField);
    if (sortField) {
      query.sortField = sortField;
      query.sortOrder = sortOrder;
    }
  }
  if (queryParams.agg && queryParams.agg.fields) {
    // fields may be passed as array of fields, rather than comma-separated string
    // if so join fields to string, else leave as is
    let fields;
    if (Array.isArray(queryParams.agg.fields)) {
      fields = queryParams.agg.fields.join(",");
    } else {
      fields = queryParams.agg.fields;
    }
    const { countFields, countSize } = createAggs(fields);
    query.countFields = countFields;
    query.countSize = countSize;
  }
  return query;
}
