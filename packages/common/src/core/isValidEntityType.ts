import { HUB_ENTITY_TYPES, HubEntityType } from "./types/HubEntityType";

export const isValidEntityType = (type: string) => {
  return HUB_ENTITY_TYPES.includes(type as HubEntityType);
};
