import { IConfigurationSchema } from "../../types";

/**
 * defines the JSON schema for the map configuration settings
 */
export const MapSchema: IConfigurationSchema = {
  type: "object",
  required: [],
  properties: {
    itemId: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 1,
      default: [],
    },
  },
};
