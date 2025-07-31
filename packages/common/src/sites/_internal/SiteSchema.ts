import { IAsyncConfigurationSchema } from "../../core";
import {
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  PRIVACY_CONFIG_SCHEMA,
  SITE_ENTITY_NAME_SCHEMA,
} from "../../core/schemas/shared";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type SiteEditorType = (typeof SiteEditorTypes)[number];
export const SiteEditorTypes = [
  "hub:site:edit",
  "hub:site:create",
  "hub:site:followers",
  "hub:site:discussions",
  "hub:site:settings",
  "hub:site:assistant",
  "hub:site:settings:discussions",
] as const;

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const getSiteSchema = (siteId: string) =>
  ({
    $async: true,
    ...HubItemEntitySchema,
    properties: {
      ...HubItemEntitySchema.properties,
      name: SITE_ENTITY_NAME_SCHEMA,
      _discussions: ENTITY_IS_DISCUSSABLE_SCHEMA,
      telemetry: PRIVACY_CONFIG_SCHEMA,
      _urlInfo: {
        type: "object",
        isUniqueDomain: { siteId },
        required: ["subdomain"],
        properties: {
          subdomain: {
            type: "string",
            format: "slug" as any,
          },
        },
      },
      discussionSettings: {
        type: "object",
        properties: {
          allowedChannelIds: {
            type: "array",
            items: {
              type: "string",
            },
          },
          allowedLocations: {
            type: "array",
            items: {
              type: "object",
            },
          },
        },
      },
    },
  } as IAsyncConfigurationSchema);
