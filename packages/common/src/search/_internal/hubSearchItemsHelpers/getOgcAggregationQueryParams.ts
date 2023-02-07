import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * Creates a hash of query parameters that should be appended onto an
 * aggregations request for the OGC API.
 *
 * @param _query
 * @param options options object to serialize values from
 * @returns
 */
export function getOgcAggregationQueryParams(
  _query: IQuery,
  options: IHubSearchOptions
) {
  // TODO: use options.aggLimit once the OGC API supports it
  const aggregations = `terms(fields=(${options.aggFields.join()}))`;
  // TODO: Use `query` to filter aggregations once the OGC API supports it
  const token = getProp(options, "requestOptions.authentication.token");

  return { aggregations, token };
}
