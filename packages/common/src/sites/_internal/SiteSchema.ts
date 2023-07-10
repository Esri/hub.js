import { IConfigurationSchema } from "../../core";
import { HubItemEntitySubschema } from "../../core/schemas/shared/hubItemEntitySubschema";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = ["hub:site:edit"] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const SiteSchema: IConfigurationSchema = {
  ...HubItemEntitySubschema,
} as IConfigurationSchema;
