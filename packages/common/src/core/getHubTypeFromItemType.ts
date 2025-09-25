import { getTypeFromEntity } from "./getTypeFromEntity";
import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";

/**
 * Given an item type, return its HubEntityType
 * Simple wrapper over the poorly named `getTypeFromEntity` function
 * @param itemType
 * @returns
 */

export function getHubTypeFromItemType(itemType: string): HubEntityType {
  const fakeEntity: Partial<HubEntity> = {
    type: itemType,
  };
  return getTypeFromEntity(fakeEntity);
}
