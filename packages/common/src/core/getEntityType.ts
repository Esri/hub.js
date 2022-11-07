import { HubEntity } from "./types/HubEntity";
import { HubEntityType } from "./types/HubEntityType";

/**
 * Given a HubEntity, return it's HubEntityType
 * @param entity
 * @returns
 */
export function getTypeFromEntity(entity: HubEntity): HubEntityType {
  let type: HubEntityType;
  switch (entity.type) {
    case "Hub Site Application":
    case "Site Application":
      type = "site";
      break;
    case "Hub Page":
    case "Site Page":
      type = "page";
      break;
    case "Hub Project":
      type = "project";
      break;
    case "Hub Initiative":
      type = "initiative";
      break;
  }
  return type;
}
