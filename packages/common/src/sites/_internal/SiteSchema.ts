import { IConfigurationSchema } from "../../core";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = ["hub:site:edit"] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const SiteSchema: IConfigurationSchema = {
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
    access: ENTITY_ACCESS_SCHEMA,
    groups: {
      type: "array",
      items: {
        type: "string",
      },
    },
    // status: {
    //   type: "string",
    //   default: PROJECT_STATUSES.notStarted,
    //   enum: Object.keys(PROJECT_STATUSES),
    // },
    location: {
      type: "object",
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
        // TODO: extend this schema definition to provide
        // appropriate validation for the timeline editor
        timeline: {
          type: "object",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;
