import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";
import { PROJECT_STATUSES } from "../../core/types/IHubProject";

export type ProjectEditorType = (typeof ProjectEditorTypes)[number];
export const ProjectEditorTypes = [
  "hub:project:create",
  "hub:project:edit",
  "hub:project:metrics",
] as const;

/**
 * Defines the JSON schema for a Hub Project's editable fields
 */
export const ProjectSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    _groups: {
      type: "array",
      items: { type: "string" },
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    _metrics: MetricSchema,
  },
} as IConfigurationSchema;
