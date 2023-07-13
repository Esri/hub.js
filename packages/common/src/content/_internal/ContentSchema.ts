import { PROJECT_STATUSES, IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type ContentEditorType = (typeof ContentEditorTypes)[number];
export const ContentEditorTypes = [
  // "hub:project:create",
  "hub:content:edit",
] as const;

/**
 * defines the JSON schema for a Hub Project's editable fields
 */
export const ContentSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    groups: {
      type: "array",
      items: { type: "string" },
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
  },
} as IConfigurationSchema;
