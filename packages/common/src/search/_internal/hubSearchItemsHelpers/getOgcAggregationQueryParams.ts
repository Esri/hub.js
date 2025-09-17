import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getFilterQueryParam } from "./getFilterQueryParam";
import { getQQueryParam } from "./getQQueryParam";
import { getBboxQueryParam } from "./getBboxQueryParam";

export interface IOgcAggregationQueryParams {
  aggregations: string;
  filter?: string;
  bbox?: string;
  q?: string;
  token?: string;
}

export function getOgcAggregationQueryParams(
  query: IQuery,
  options: IHubSearchOptions
): IOgcAggregationQueryParams {
  // TODO: use options.aggLimit once the OGC API supports it
  const aggregations = `terms(fields=(${options.aggFields.join()}))`;
  const filter = getFilterQueryParam(query);
  const bbox = getBboxQueryParam(query);
  const q = getQQueryParam(query);
  const token = getProp(
    options,
    "requestOptions.authentication.token"
  ) as string;

  return {
    aggregations,
    bbox,
    filter,
    q,
    token,
  };
}
