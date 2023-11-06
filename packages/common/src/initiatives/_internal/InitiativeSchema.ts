import { IConfigurationSchema, INITIATIVE_STATUSES } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];
export const InitiativeEditorTypes = [
  "hub:initiative:edit",
  "hub:initiative:create",
] as const;

/**
 * defines the JSON schema for a Hub Initiative's editable fields
 */
export const InitiativeSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    status: {
      type: "string",
      default: INITIATIVE_STATUSES.notStarted,
      enum: Object.keys(INITIATIVE_STATUSES),
    },
  },
} as IConfigurationSchema;
