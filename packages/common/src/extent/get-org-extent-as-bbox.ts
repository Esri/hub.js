import { IHubRequestOptions, IBBox } from "../types";
import { getGeographicOrgExtent } from "./get-geographic-org-extent";
import { extentToBBox } from "./extent-to-bbox";

/**
 * Get the default org extent as a bbox for use on item.extent
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getOrgExtentAsBBox(
  hubRequestOptions: IHubRequestOptions
): Promise<IBBox> {
  return getGeographicOrgExtent(hubRequestOptions).then(extent =>
    extentToBBox(extent)
  );
}
