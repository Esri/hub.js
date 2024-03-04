import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { HubEntityStatus } from "../../types";

export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];
export const InitiativeEditorTypes = [
  "hub:initiative:edit",
  "hub:initiative:create",
  "hub:initiative:metrics",
] as const;

/**
 * defines the JSON schema for a Hub Initiative's editable fields
 */
export const InitiativeSchema: IConfigurationSchema = {
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
      },
    },
  },
  allOf: [
    {
      if: {
        type: "object",
        properties: {
          _metric: {
            type: "object",
            properties: {
              type: {
                const: "static",
              },
            },
          },
        },
      },
      then: {
        type: "object",
        properties: {
          _metric: {
            required: ["value"],
          },
        },
      },
    },
  ],
} as IConfigurationSchema;
