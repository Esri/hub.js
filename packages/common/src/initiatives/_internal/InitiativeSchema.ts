import { MetricSchema } from "../../core/schemas/internal/metrics/MetricSchema";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { HubEntityStatus } from "../../enums/hubEntityStatus";
import {
  IF_SOURCE_TITLE_THEN_SOURCE_LINK,
  IF_STATIC_THEN_REQUIRE_VALUE,
  IF_STATIC_THEN_URL_FORMAT,
  VALUE_TYPE_MAPPING,
} from "../../core/schemas/internal/metrics/definitions";
import { IConfigurationSchema } from "../../core/schemas/types";

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
      properties: MetricSchema.properties,
    },
  },
  allOf: [
    IF_SOURCE_TITLE_THEN_SOURCE_LINK,
    IF_STATIC_THEN_REQUIRE_VALUE,
    IF_STATIC_THEN_URL_FORMAT,
    VALUE_TYPE_MAPPING,
  ],
} as IConfigurationSchema;
