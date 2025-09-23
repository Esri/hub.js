import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

/**
 * defines the JSON schema for a Hub Site's editable fields
 */
export const PageSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
  },
} as unknown as IConfigurationSchema;
