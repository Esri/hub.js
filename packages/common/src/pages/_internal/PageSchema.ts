import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export const PageEditorTypes = ["hub:page:edit"] as const;
export type PageEditorType = (typeof PageEditorTypes)[number];

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const PageSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
  },
} as unknown as IConfigurationSchema;
