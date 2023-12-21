import { HubEntityType } from "./types";

/**
 * Given a Hub entity type, return its item type(s).
 * This is effectively the reverse of getTypeFromEntity
 *
 * @param entityType - the hub entity type
 * @returns {string[]}
 */
export const getTypesFromEntityType = (entityType: HubEntityType): string[] => {
  let type = [] as string[];
  switch (entityType) {
    case "site":
      type = ["Hub Site Application", "Site Application"];
      break;
    case "page":
      type = ["Hub Page", "Site Page"];
      break;
    case "project":
      type = ["Hub Project"];
      break;
    case "initiative":
      type = ["Hub Initiative"];
      break;
    case "discussion":
      type = ["Discussion"];
      break;
    case "template":
      type = ["Solution"];
      break;
    case "group":
      type = ["Group"];
      break;
    case "initiativeTemplate":
      type = ["Hub Initiative Template"];
      break;
  }
  return type;
};
