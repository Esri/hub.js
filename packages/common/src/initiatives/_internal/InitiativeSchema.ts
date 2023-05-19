import { IConfigurationSchema } from "../../core";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../core/schemas/shared";

export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];
export const InitiativeEditorTypes = ["hub:initiative:edit"] as const;

/**
 * defines the JSON schema for a Hub Initiative's editable fields
 */
export const InitiativeSchema: IConfigurationSchema = {
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
