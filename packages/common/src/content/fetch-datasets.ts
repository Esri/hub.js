import { DatasetResource, IHubRequestOptions, hubApiRequest } from "..";

export function fetchDatasets(
  requestOptions: IHubRequestOptions
): Promise<{ data: DatasetResource[] }> {
  return hubApiRequest("/datasets", requestOptions);
}
