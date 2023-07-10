import { IConfigurationSchema } from "../../core";
import { HubItemEntitySubschema } from "../../core/schemas/shared/hubItemEntitySubschema";

export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];
export const InitiativeEditorTypes = ["hub:initiative:edit"] as const;

/**
 * defines the JSON schema for a Hub Initiative's editable fields
 */
export const InitiativeSchema: IConfigurationSchema = {
  ...HubItemEntitySubschema,
} as IConfigurationSchema;
