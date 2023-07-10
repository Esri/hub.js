import { PROJECT_STATUSES, IConfigurationSchema } from "../../core";
import { HubItemEntitySubschema } from "../../core/schemas/shared/hubItemEntitySubschema";

export type ProjectEditorType = (typeof ProjectEditorTypes)[number];
export const ProjectEditorTypes = [
  "hub:project:create",
  "hub:project:edit",
] as const;

/**
 * defines the JSON schema for a Hub Project's editable fields
 */
export const ProjectSchema: IConfigurationSchema = {
  ...HubItemEntitySubschema,
  properties: {
    ...HubItemEntitySubschema.properties,
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
