import { IConfigurationSchema } from "../../core";
import { ENTITY_NAME_SCHEMA } from "../../core/schemas/shared";

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
  },
} as unknown as IConfigurationSchema;
