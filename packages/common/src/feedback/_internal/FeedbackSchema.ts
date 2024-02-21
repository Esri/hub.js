import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

export type FeedbackEditorType = (typeof FeedbackEditorTypes)[number];
export const FeedbackEditorTypes = [
  "hub:feedback:edit",
  "hub:feedback:settings",
] as const;

/**
 * defines the JSON schema for a Feedback entity's editable fields
 */
export const FeedbackSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    displayMap: {
      type: "boolean",
      enum: [true, false],
      default: false,
    },
    hasMapQuestion: {
      type: "boolean",
      enum: [true, false],
      default: false,
    },
    ...HubItemEntitySchema.properties,
  },
} as IConfigurationSchema;
