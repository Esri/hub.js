import { IHubSearchOptions } from "../../types/IHubSearchOptions";

export function getSortByQueryParam(options: IHubSearchOptions) {
  const { sortField, sortOrder } = options;
  let result;
  if (sortField) {
    result =
      sortOrder === "desc"
        ? `-properties.${sortField}`
        : `properties.${sortField}`;
  }
  return result;
}
