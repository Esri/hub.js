import { PROJECT_STATUSES, IConfigurationSchema } from "../../core";
import {
  ENTITY_EXTENT_SCHEMA,
  ENTITY_NAME_SCHEMA,
} from "../../core/schemas/shared";

export type ProjectEditorType = typeof ProjectEditorTypes[number];
export const ProjectEditorTypes = [
  "hub:project:create",
  "hub:project:edit",
] as const;

/**
 * defines the JSON schema for a Hub Project's editable fields
 */
export const ProjectSchema: IConfigurationSchema = {
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
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
    categories: {
      type: "array",
      items: {
        type: "string",
      },
    },
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
