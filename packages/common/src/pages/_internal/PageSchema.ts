import { IConfigurationSchema } from "../../core";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared";

export const PageEditorTypes = ["hub:page:edit"] as const;
export type PageEditorType = (typeof PageEditorTypes)[number];

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const PageSchema: IConfigurationSchema = {
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
    location: {
      type: "object",
    },
    tags: ENTITY_TAGS_SCHEMA,
    categories: ENTITY_CATEGORIES_SCHEMA,
  },
} as unknown as IConfigurationSchema;
