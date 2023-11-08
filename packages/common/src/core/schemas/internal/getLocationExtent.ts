import { bBoxToExtent, orgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { IHubLocation } from "../../types";

/**
 * Get the extent from the entity's location, if it has one.
 * Otherwise, fall back to using the org extent.
 */
export async function getLocationExtent(
  location: IHubLocation,
  hubRequestOptions: IHubRequestOptions
) {
  return location?.extent?.length
    ? bBoxToExtent(location.extent)
    : await orgExtent(hubRequestOptions);
}
