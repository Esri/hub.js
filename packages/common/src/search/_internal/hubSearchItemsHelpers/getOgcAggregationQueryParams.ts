import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getOpenDataQueryParam } from "./getOpenDataQueryParam";

export function getOgcAggregationQueryParams(
  query: IQuery,
  options: IHubSearchOptions
) {
  // TODO: use options.aggLimit once the OGC API supports it
  const aggregations = `terms(fields=(${options.aggFields.join()}))`;
  // TODO: Use the rest of `query` to filter aggregations once the OGC API supports it
  const openData = getOpenDataQueryParam(query);
  const token = getProp(options, "requestOptions.authentication.token");

  return {
    aggregations,
    openData,
    token,
  };
}
