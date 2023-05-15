import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getBboxQueryParam } from "./getBboxQueryParam";
import { getFilterQueryParam } from "./getFilterQueryParam";
import { getQQueryParam } from "./getQQueryParam";
import { getSortByQueryParam } from "./getSortByQueryParam";

export interface IOgcItemQueryParams {
  filter?: string;
  token?: string;
  limit?: number;
  startindex?: number;
  q?: string;
  sortBy?: string;
  bbox?: string;
}

/**
 * @private
 * Derives a hash of query params that should be included with a request
 * to the /items endpoint of an OGC API collection
 *
 * @param query an IQuery to derive query params from
 * @param options an IHubSearchOptions object to derive query params from
 * @returns a hash of query params to be included in the request
 */
export function getOgcItemQueryParams(
  query: IQuery,
  options: IHubSearchOptions
): IOgcItemQueryParams {
  const filter = getFilterQueryParam(query);
  const token = getProp(options, "requestOptions.authentication.token");
  const limit = options.num;
  // API requires the param name be all lowercase
  const startindex = options.start;
  const q = getQQueryParam(query);
  const sortBy = getSortByQueryParam(options);
  const bbox = getBboxQueryParam(query);

  return {
    filter,
    token,
    limit,
    startindex,
    q,
    sortBy,
    bbox,
  };
}
