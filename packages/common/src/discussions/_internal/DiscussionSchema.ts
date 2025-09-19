import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

export type DiscussionEditorType = (typeof DiscussionEditorTypes)[number];
export const DiscussionEditorTypes = [
  "hub:discussion:edit",
  "hub:discussion:create",
  "hub:discussion:settings",
  "hub:discussion:settings:discussions",
] as const;

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
