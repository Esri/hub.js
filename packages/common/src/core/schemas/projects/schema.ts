import { IConfigurationSchema } from "../types";
import { PROJECT_STATUSES } from "../../types";

export const HubProjectSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 250,
    },
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
    extent: {
      type: "object",
    },
    view: {
      type: "object",
      properties: {
        featuredContentIds: {
          type: "array",
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
        timeline: {
          type: "object",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;
