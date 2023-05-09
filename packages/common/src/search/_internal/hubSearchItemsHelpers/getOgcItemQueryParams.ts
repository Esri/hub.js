import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
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
}

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

  return {
    filter,
    token,
    limit,
    startindex,
    q,
    sortBy,
  };
}
