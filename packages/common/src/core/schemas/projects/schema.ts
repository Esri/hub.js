import { IConfigurationSchema } from "../types";
import { PROJECT_STATUSES } from "../../types";
import {
  ENTITY_NAME_SCHEMA,
  ITEM_PICKER_SCHEMA,
  EXTENT_SCHEMA,
} from "../shared";

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
    extent: EXTENT_SCHEMA,
    view: {
      type: "object",
      properties: {
        featuredContentIds: ITEM_PICKER_SCHEMA,
        featuredImage: {
          type: "object",
        },
        showMap: {
          type: "boolean",
        },
        timeline: {
          type: "object",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;
