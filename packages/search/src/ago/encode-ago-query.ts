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
  const queryParts = ["-access:public", '-type:"code attachment"'];
  // Build the potentially enourmous 'q' parameter. In future use SearchQueryBuilder from arcgis-rest-js
  if (queryParams.q) {
    queryParts.push(queryParams.q);
  }
  if (queryParams.catalog) {
    const filter = createFilters(queryParams.catalog);
    queryParts.push(handleFilter(filter));
  }
  if (queryParams.filter) {
    // queryParams filter is an obj with key<string>: value<string> where value is serialized as 'all(a,b)'
    // so parse each filter string into fn and terms
    const filter = createFilters(queryParams.filter);
    // add each parsed filter object into ago query
    queryParts.push(handleFilter(filter));
  }
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
    const { countFields, countSize } = createAggs(queryParams.agg.fields);
    query.countFields = countFields;
    query.countSize = countSize;
  }
  return query;
}
