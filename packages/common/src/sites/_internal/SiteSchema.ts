import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = ["hub:site:edit", "hub:site:create"] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const SiteSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
} as IConfigurationSchema;
