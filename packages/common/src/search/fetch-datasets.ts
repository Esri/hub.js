import { DatasetResource, IHubRequestOptions, hubApiRequest } from "..";

export function fetchDatasets(
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
