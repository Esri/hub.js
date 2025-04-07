import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

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
    // TODO: externalize & spread onto HubItemEntitySchema rather than here
    discussionSettings: {
      type: "object",
      properties: {
        allowedChannelIds: {
          type: "array",
          items: {
            type: "string",
          },
        },
        allowedLocations: {
          type: "array",
          items: {
            type: "object",
          },
        },
      },
    },
  },
} as IConfigurationSchema;
