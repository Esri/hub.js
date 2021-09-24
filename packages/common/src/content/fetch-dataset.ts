import { DatasetResource, IHubRequestOptions, hubApiRequest } from "..";

export function fetchDataset(
  identifier: string,
  requestOptions: IHubRequestOptions
): Promise<{ data: DatasetResource }> {
  return hubApiRequest(`/datasets/${identifier}`, requestOptions);
}
