import { IItem } from "@esri/arcgis-rest-types";
import { IHubItemEntity } from "../types";
import { deriveLocationFromItem } from "../../content/_internal/internalContentUtils";

/**
 * Base property mapping for item backed entity types
 * @param item IItem
 * @param entity IHubItemEntity
 * @returns
 */
export function computeBaseProps<T extends Partial<IHubItemEntity>>(
  item: IItem,
  entity: T
): T {
  // TODO: Currently only location is determined for base
  // properties, but all properties that are commonly shared
  // across items should be moved here.
  entity.location = entity.location || deriveLocationFromItem(item);
  return entity;
}
