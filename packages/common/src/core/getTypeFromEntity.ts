import { getFamily } from "../content/get-family";
import { HubEntity, IHubItemEntity, HubEntityType } from "./types";

/**
 * Given a HubEntity, return its HubEntityType
 * @param entity
 * @returns
 */
export function getTypeFromEntity(
  entity: IHubItemEntity | Partial<HubEntity>
): HubEntityType {
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
    case "Discussion":
      type = "discussion";
      break;
    case "Solution":
      type = "template";
      break;
    case "Channel":
      type = "channel";
      break;
    case "Group":
      type = "group";
      break;
    case "Hub Initiative Template":
      type = "initiativeTemplate";
      break;
    case "Event":
      type = "event";
      break;
    case "User":
      type = "user";
      break;
    // case "Hub Content": // needed for future ticket in getLocationOptions
    //   type = "content";
    //   break;
    default: {
      // TODO: other families go here? solution? template?
      const contentFamilies = [
        "app",
        "content",
        "dataset",
        "document",
        "map",
        "feedback",
      ];
      if (contentFamilies.includes(getFamily(entity.type || ""))) {
        type = "content";
      }
    }
  }
  return type;
}
