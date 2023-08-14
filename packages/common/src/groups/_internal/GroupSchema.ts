import { IConfigurationSchema } from "../../core";
import {
  ENTITY_IMAGE_SCHEMA,
  ENTITY_NAME_SCHEMA,
} from "../../core/schemas/shared";

export type GroupEditorType = (typeof GroupEditorTypes)[number];
export const GroupEditorTypes = ["hub:group:edit"] as const;

/**
 * Defines the JSON schema for a Hub Group's editable fields
 */
export const GroupSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      type: "string",
    },
    _thumbnail: ENTITY_IMAGE_SCHEMA,
  },
} as IConfigurationSchema;
