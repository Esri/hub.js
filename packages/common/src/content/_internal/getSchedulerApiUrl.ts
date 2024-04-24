import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getHubApiUrl } from "../../api";

export function getSchedulerApiUrl(
  itemId: string,
  requestOptions: IRequestOptions
): string {
  // sometimes the url has /api/v3 at the end, so we need to remove it
  const hubApiUrlWithVersion = getHubApiUrl(requestOptions);
  const hubApiUrlRoot = hubApiUrlWithVersion.replace(/\/api\/v3$/, "");
  return `${hubApiUrlRoot}/api/download/v1/items/${itemId}/schedule`;
}
