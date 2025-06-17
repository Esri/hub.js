import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getFilterQueryParam } from "./getFilterQueryParam";

export interface IOgcAggregationQueryParams {
  aggregations: string;
  filter?: string;
  token?: string;
}

export function getOgcAggregationQueryParams(
  query: IQuery,
  options: IHubSearchOptions
): IOgcAggregationQueryParams {
  // TODO: use options.aggLimit once the OGC API supports it
  const aggregations = `terms(fields=(${options.aggFields.join()}))`;
  const filter = getFilterQueryParam(query);
  const token = getProp(
    options,
    "requestOptions.authentication.token"
  ) as string;

  return {
    aggregations,
    filter,
    token,
  };
}
