import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

export type SurveyEditorType = (typeof SurveyEditorTypes)[number];
export const SurveyEditorTypes = [
  "hub:survey:edit",
  "hub:survey:settings",
] as const;

/**
 * defines the JSON schema for a Survey entity's editable fields
 */
export const SurveySchema: IConfigurationSchema = {
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
