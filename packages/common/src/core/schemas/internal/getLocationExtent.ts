import { bBoxToExtent, orgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { ConfigurableEntity } from "./ConfigurableEntity";
/**
 * Get the extent from the entity's location, if it has one.
 * Otherwise, fall back to using the org extent.
 */
export async function getLocationExtent(
  entity: ConfigurableEntity,
  hubRequestOptions: IHubRequestOptions
) {
  return entity.location?.extent?.length
    ? bBoxToExtent(entity.location.extent)
    : await orgExtent(hubRequestOptions);
}
