import { IConfigurationSchema } from "../../core";
import {
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  PRIVACY_CONFIG_SCHEMA,
} from "../../core/schemas/shared";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = [
  "hub:site:edit",
  "hub:site:create",
  "hub:site:followers",
  "hub:site:discussions",
  "hub:site:settings",
] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const SiteSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    _discussions: ENTITY_IS_DISCUSSABLE_SCHEMA,
    telemetry: PRIVACY_CONFIG_SCHEMA,
  },
} as IConfigurationSchema;
