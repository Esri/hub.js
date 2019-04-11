import { ISearchParams } from "../common/params";
import { createFilters } from "../common/create-filters";

/**
 * An intermediate query object parsed from query parameters
 */
export interface IQueryObject {
  page?: { size: number; number: number };
  sort?: { field: string; order?: string };
  q?: string;
  bbox?: string;
  locationName?: string;
  fields?: string;
  agg?: { fields: string[] };
  filter?: any;
  [key: string]: any;
}

/**
 * Create intermediate query object parsed from ISearchParams
 *
 * @export
 * @param {ISearchParams} params
 * @returns {Promise<IQueryObject>}
 */
export function createQueryObject(params: ISearchParams): IQueryObject {
  const queryObject: IQueryObject = {};
  const filter = createFilters(params);
  const page = {
    page: {
      size: typeof params.size === "number" ? params.size : 10,
      number: params.page || 1
    }
  };
  // sort parameters starting with '-' are interpreted as descending order
  let sort = { sort: { field: "relevance", order: "desc" } };
  if (params.sort) {
    if (params.sort[0] === "-") {
      sort = {
        sort: { field: params.sort.slice(1, params.sort.length), order: "desc" }
      };
    } else {
      sort = { sort: { field: params.sort, order: "asc" } };
    }
  }
  if (params.q) {
    queryObject.q = params.q;
  }
  if (params.bbox) {
    queryObject.bbox = params.bbox;
  }
  if (params.locationName) {
    queryObject.locationName = params.locationName;
  }
  if (params.fields) {
    queryObject.fields = params.fields;
  }
  if (params.agg) {
    queryObject.agg = params.agg;
  }
  return Object.assign({}, queryObject, filter, page, sort);
}
