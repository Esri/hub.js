import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

/**
 * defines the JSON schema for a Discussion's editable fields
 */
export const DiscussionSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  required: ["name"],
  properties: {
    ...HubItemEntitySchema.properties,
    prompt: {
      type: "string",
      default: "",
      maxLength: 150,
    },
  },
} as IConfigurationSchema;
