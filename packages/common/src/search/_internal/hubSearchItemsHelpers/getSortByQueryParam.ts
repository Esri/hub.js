import { IHubSearchOptions } from "../../types/IHubSearchOptions";

/**
 * @private
 * Serializes the sort options provided from the request options
 * object into a string that the OGC API can understand
 *
 * @param options IHubSearchOptions that contain sorting information
 * @returns a serialized sort string
 */
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
