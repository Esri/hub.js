import { DatasetResource, IHubRequestOptions, hubApiRequest } from "..";
/**
 * Search the Hub API
 *
 * @param requestOptions
 * @returns JSONAPI response
 */
export function hubApiSearch(
  requestOptions: IHubRequestOptions
): Promise<{ data: DatasetResource[] }> {
  // derive default headers if authentication
  const authentication = requestOptions.authentication;
  const headers = authentication &&
    authentication.serialize && { authentication: authentication.serialize() };
  const defaults: IHubRequestOptions = {
    headers,
    httpMethod: "POST",
  };
  return hubApiRequest("/search", {
    ...defaults,
    ...requestOptions,
  });
}
