import { bBoxToExtent, getGeographicOrgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { HubEntity } from "../../types/HubEntity";

/**
 * Get the extent from the entity's location, if it has one.
 * Otherwise, fall back to using the org extent.
 */
export async function getLocationExtent(
  entity: HubEntity,
  hubRequestOptions: IHubRequestOptions
) {
  return entity?.location?.extent?.length
    ? bBoxToExtent(entity.location.extent)
    : await getGeographicOrgExtent(hubRequestOptions);
}
