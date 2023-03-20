import { IConfigurationSchema } from "../types";

export const HubInitiativeSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 250,
    },
    summary: {
      type: "string",
    },
  },
} as unknown as IConfigurationSchema;
