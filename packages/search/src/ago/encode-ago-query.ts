import { IQueryObject } from "./serialize";
import { calcStart, handleFilter, getSortField } from "./helpers";

export function encodeAgoQuery(queryObject: IQueryObject) {
  const query: any = {
    q: null,
    start: calcStart(queryObject),
    num:
      queryObject && queryObject.page && queryObject.page.size
        ? queryObject.page.size
        : 10
  };
  // start with 'implicit' query filters
  // - '-access: public'
  const queryParts = ["-access:public", '-type:"code attachment"'];
  // build the potentially enourmous 'q' parameter
  if (queryObject.q) {
    queryParts.push(queryObject.q);
  }
  if (queryObject.filter) {
    queryParts.push(handleFilter(queryObject.filter));
  }
  if (queryParts.length > 0) {
    query.q = queryParts.join(" AND ");
  }
  if (queryObject.sort) {
    query.bbox = queryObject.bbox;
  }
  if (queryObject.sort) {
    const sortField = getSortField(queryObject.sort.field);
    if (sortField) {
      query.sortField = sortField;
      query.sortOrder = queryObject.sort.order;
    }
  }
  if (queryObject.countFields) {
    query.countFields = queryObject.countFields;
  }
  if (queryObject.countSize) {
    query.countSize = queryObject.countSize;
  }
  return query;
}
