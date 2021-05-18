import { getHubApiUrl, IHubRequestOptions } from "@esri/hub-common";

/**
 * Return a minimal IHubRequestOptions object for
 * use in functions that don't require authentication
 * but do need some url information
 *
 * @export
 */

export function getDefaultRequestOptions(
  portalUrl: string = "https://maps.arcgis.com/sharing/rest"
): IHubRequestOptions {
  // all we need is the portal url, and we compute the
  // hub api url from that
  const result = {
    portal: portalUrl,
    hubApiUrl: getHubApiUrl(portalUrl)
  } as IHubRequestOptions;
  return result;
}
