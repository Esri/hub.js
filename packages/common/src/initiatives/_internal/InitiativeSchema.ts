import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { HubEntityStatus } from "../../types";
import {
  IF_SOURCE_TITLE_THEN_SOURCE_LINK,
  IF_STATIC_THEN_REQUIRE_VALUE,
  VALUE_TYPE_MAPPING,
} from "../../core/schemas/internal/metrics/definitions";

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
      ...MetricSchema,
      required: ["cardTitle"],
    },
  },
  allOf: [
    IF_SOURCE_TITLE_THEN_SOURCE_LINK,
    IF_STATIC_THEN_REQUIRE_VALUE,
    VALUE_TYPE_MAPPING,
  ],
} as IConfigurationSchema;
