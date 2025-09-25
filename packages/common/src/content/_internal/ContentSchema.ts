import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";
import { IConfigurationSchema } from "../../core/schemas/types";

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
    serverExtractCapability: {
      type: "boolean",
      enum: [true, false],
    },
    schedule: {
      type: "object",
    },
    _forceUpdate: {
      type: "array",
      items: {
        type: "boolean",
        enum: [true],
      },
    },
    downloadFormats: {
      type: "array",
      items: {
        type: "object",
      },
    },
  },
} as IConfigurationSchema;
