import { IItem } from "@esri/arcgis-rest-types";
import { IHubItemEntity } from "../types";
import { deriveLocationFromItem } from "../../content/_internal/internalContentUtils";

/**
 * Base property mapping for item backed entity types
 * @param item IItem
 * @param entity IHubItemEntity
 * @returns
 */
export function computeBaseProps<EntityType extends Partial<IHubItemEntity>>(
  item: IItem,
  entity: EntityType
): EntityType {
  entity.location = deriveLocationFromItem(item);
  return entity;
}
