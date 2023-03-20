import { IConfigurationSchema } from "../types";
import { ENTITY_NAME_SCHEMA } from "../shared";

export const HubInitiativeSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      type: "string",
    },
  },
} as unknown as IConfigurationSchema;
