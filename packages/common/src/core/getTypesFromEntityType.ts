import { HubEntityType } from "./types";

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
    case "content":
      // TODO: not sure how to handle content
      type = [];
      break;
  }
  return type;
};
