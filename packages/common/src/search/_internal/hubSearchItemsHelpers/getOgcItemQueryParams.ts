import { getProp } from "../../../objects/get-prop";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getFilterQueryParam } from "./getFilterQueryParam";
import { getQQueryParam } from "./getQQueryParam";

export function getOgcItemQueryParams(
  query: IQuery,
  options: IHubSearchOptions
) {
  const filter = getFilterQueryParam(query);
  const token = getProp(options, "requestOptions.authentication.token");
  const limit = options.num;
  // API requires the param name be all lowercase
  const startindex = options.start;
  const q = getQQueryParam(query);

  return { filter, token, limit, startindex, q };
}
