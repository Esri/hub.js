import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";

/**
 * @private
 * Returns information about the current environment's OGC API
 *
 * @param options IHubRequestOptions to derive OGC API info from
 * @returns an IApiDefinition with needed info to target the OGC API
 */
export function getOgcApiDefinition(
  options: IHubSearchOptions
): IApiDefinition {
  const umbrellaDomain = new URL(options.requestOptions.hubApiUrl).hostname;
  return {
    type: "arcgis-hub",
    url: `https://${umbrellaDomain}/api/search/v1`,
  };
}
