import { IConfigurationSchema } from "../../core";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared";

export type DiscussionEditorType = (typeof DiscussionEditorTypes)[number];
export const DiscussionEditorTypes = [
  "hub:discussion:edit",
  "hub:discussion:create",
] as const;

/**
 * defines the JSON schema for a Discussion's editable fields
 */
export const DiscussionSchema: IConfigurationSchema = {
  required: ["name", "prompt"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    prompt: {
      type: "string",
    },
    summary: {
      type: "string",
    },
    description: {
      type: "string",
    },
    location: {
      type: "object",
    },
    tags: ENTITY_TAGS_SCHEMA,
    categories: ENTITY_CATEGORIES_SCHEMA,
    view: {
      type: "object",
      properties: {
        featuredImage: {
          type: "object",
        },
        featuredImageName: {
          type: "string",
        },
        featuredImageAltText: {
          type: "string",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;
