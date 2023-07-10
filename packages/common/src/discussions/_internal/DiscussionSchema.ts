import { IConfigurationSchema } from "../../core";
import { HubItemEntitySubschema } from "../../core/schemas/shared/hubItemEntitySubschema";

export type DiscussionEditorType = (typeof DiscussionEditorTypes)[number];
export const DiscussionEditorTypes = [
  "hub:discussion:edit",
  "hub:discussion:create",
] as const;

/**
 * defines the JSON schema for a Discussion's editable fields
 */
export const DiscussionSchema: IConfigurationSchema = {
  ...HubItemEntitySubschema,
  properties: {
    ...HubItemEntitySubschema.properties,
    prompt: {
      type: "string",
      default: "We want to hear from you!",
    },
  },
} as IConfigurationSchema;
