import { getEntityTypeFromType } from "../search/_internal/getEntityTypeFromType";
import { EntityType } from "../search/types/IHubCatalog";
import { HubEntityType } from "./types/HubEntityType";

/**
 * Convert from a Hub Entity Type (e.g. "site") to an EntityType (e.g. "item")
 * @param type
 * @returns
 */
export function getEntityTypeFromHubEntityType(
  type: HubEntityType
): EntityType {
  return getEntityTypeFromType(type);
}
