import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
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
      properties: {
        ...MetricSchema.properties,
        cardTitle: {
          type: "string",
          minLength: 1,
        },
        value: {
          type: "string",
          minLength: 1,
        },
      },
    },
  },
  allOf: [
    {
      if: {
        properties: {
          _metric: {
            properties: {
              type: {
                const: "static",
              },
            },
          },
        },
      },
      then: {
        properties: {
          _metric: {
            required: ["value"],
          },
        },
      },
    },
  ],
} as IConfigurationSchema;
