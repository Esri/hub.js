import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type ContentEditorType = (typeof ContentEditorTypes)[number];
export const ContentEditorTypes = [
  "hub:content:edit",
  "hub:content:discussions",
] as const;

/**
 * defines the JSON schema for a Hub Content's editable fields
 */
export const ContentSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    licenseInfo: {
      type: "string",
    },
  },
} as IConfigurationSchema;
