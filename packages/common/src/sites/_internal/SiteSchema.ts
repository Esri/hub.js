import { IConfigurationSchema } from "../../core";
import { ENTITY_IS_DISCUSSABLE_SCHEMA } from "../../core/schemas/shared";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = [
  "hub:site:edit",
  "hub:site:create",
  "hub:site:followers",
  "hub:site:discussions",
] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const SiteSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    _discussions: ENTITY_IS_DISCUSSABLE_SCHEMA,
  },
} as IConfigurationSchema;
