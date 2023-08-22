import { IConfigurationSchema } from "../../core";
import {
  ENTITY_IMAGE_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_CONTRIBUTE_SCHEMA,
  ENTITY_VIEW_ACCESS_SCHEMA,
  ENTITY_MEMBERSHIP_ACCESS_SCHEMA,
} from "../../core/schemas/shared";

export type GroupEditorType = (typeof GroupEditorTypes)[number];
export const GroupEditorTypes = [
  "hub:group:edit",
  "hub:group:settings",
] as const;

/**
 * Defines the JSON schema for a Hub Group's editable fields
 */
export const GroupSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      ...ENTITY_SUMMARY_SCHEMA,
      // group snippets (mapped to summary on the entity) have
      // a max char limit of 250
      maxLength: 250,
    },
    _thumbnail: ENTITY_IMAGE_SCHEMA,
    access: ENTITY_VIEW_ACCESS_SCHEMA,
    membershipAccess: ENTITY_MEMBERSHIP_ACCESS_SCHEMA,
    isViewOnly: ENTITY_CONTRIBUTE_SCHEMA,
  },
} as IConfigurationSchema;
