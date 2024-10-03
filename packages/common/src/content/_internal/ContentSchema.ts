import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type ContentEditorType = (typeof ContentEditorTypes)[number];
export const ContentEditorTypes = [
  "hub:content:edit",
  "hub:content:settings",
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
