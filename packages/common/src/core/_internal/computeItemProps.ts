import type { IItem } from "@esri/arcgis-rest-portal";
import { deriveLocationFromItem } from "../../content/_internal/internalContentUtils";
import { isDiscussable } from "../../discussions/utils";
import { IHubItemEntity } from "../types/IHubItemEntity";

/**
 * Base property mapping for item backed entity types
 * @param item IItem
 * @param entity IHubItemEntity
 * @returns
 */
export function computeItemProps<T extends Partial<IHubItemEntity>>(
  item: IItem,
  entity: T
): T {
  // Handle Dates
  entity.createdDate = new Date(item.created);
  entity.createdDateSource = "item.created";
  entity.updatedDate = new Date(item.modified);
  entity.updatedDateSource = "item.modified";

  // TODO: thumbnail url?

  // location
  entity.location = entity.location || deriveLocationFromItem(item);

  // isDiscussable
  entity.isDiscussable = isDiscussable(item);

  // return updated (mutated) entity
  return entity;
}
