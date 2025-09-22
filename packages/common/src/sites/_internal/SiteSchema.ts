import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import {
  ENTERPRISE_SITE_ENTITY_NAME_SCHEMA,
  SITE_ENTITY_NAME_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  PRIVACY_CONFIG_SCHEMA,
} from "../../core/schemas/shared/subschemas";
import { IAsyncConfigurationSchema } from "../../core/schemas/types";
import { checkPermission } from "../../permissions/checkPermission";
import { IArcGISContext } from "../../types/IArcGISContext";

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const getSiteSchema = (siteId: string, context: IArcGISContext) => {
  // sites don't have slugs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _slug, ...propertiesWithoutSlug } = HubItemEntitySchema.properties;

  const nameSchema = checkPermission("hub:environment:enterprise", context)
    .access
    ? ENTERPRISE_SITE_ENTITY_NAME_SCHEMA
    : SITE_ENTITY_NAME_SCHEMA;

  return {
    $async: true,
    ...HubItemEntitySchema,
    properties: {
      ...propertiesWithoutSlug,
      name: nameSchema,
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
    },
  } as IAsyncConfigurationSchema;
};
