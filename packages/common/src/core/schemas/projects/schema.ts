import { IConfigurationSchema } from "../types";
import { PROJECT_STATUSES } from "../../types";
import { ENTITY_NAME_SCHEMA, ENTITY_EXTENT_SCHEMA } from "../shared";

export const HubProjectSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      type: "string",
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    extent: ENTITY_EXTENT_SCHEMA,
    view: {
      type: "object",
      properties: {
        featuredContentIds: {
          type: "array",
          maxItems: 4,
          items: {
            type: "string",
          },
        },
        featuredImage: {
          type: "object",
        },
        showMap: {
          type: "boolean",
        },
        // TODO: extend this schema definition to provide
        // appropriate validation for the timeline editor
        timeline: {
          type: "object",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;
