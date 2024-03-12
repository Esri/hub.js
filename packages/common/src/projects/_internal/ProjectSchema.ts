import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
import {
  IF_SOURCE_TITLE_THEN_SOURCE_LINK,
  IF_STATIC_THEN_REQUIRE_VALUE,
  VALUE_TYPE_MAPPING,
} from "../../core/schemas/internal/metrics/definitions";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";
import { HubEntityStatus } from "../../types";

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
      default: HubEntityStatus.notStarted,
      enum: Object.keys(HubEntityStatus),
    },
    _metric: {
      type: "object",
      required: ["cardTitle"],
      properties: MetricSchema.properties,
    },
  },
  allOf: [
    IF_SOURCE_TITLE_THEN_SOURCE_LINK,
    IF_STATIC_THEN_REQUIRE_VALUE,
    VALUE_TYPE_MAPPING,
  ],
} as IConfigurationSchema;
