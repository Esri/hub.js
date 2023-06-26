import { PROJECT_STATUSES, IConfigurationSchema } from "../../core";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
  ENTITY_TIMELINE_SCHEMA,
} from "../../core/schemas/shared";

export type ProjectEditorType = (typeof ProjectEditorTypes)[number];
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
    summary: ENTITY_SUMMARY_SCHEMA,
    description: {
      type: "string",
    },
    access: ENTITY_ACCESS_SCHEMA,
    groups: {
      type: "array",
      items: {
        type: "string",
      },
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    location: {
      type: "object",
      default: { type: "none" },
    },
    tags: ENTITY_TAGS_SCHEMA,
    categories: ENTITY_CATEGORIES_SCHEMA,
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
        featuredImageAltText: {
          type: "string",
        },
        timeline: ENTITY_TIMELINE_SCHEMA,
      },
    },
  },
} as unknown as IConfigurationSchema;
