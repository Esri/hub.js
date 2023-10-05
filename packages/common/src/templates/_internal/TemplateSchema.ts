import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type TemplateEditorType = (typeof TemplateEditorTypes)[number];

export const TemplateEditorTypes = ["hub:template:edit"] as const;

export const TemplateSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    previewUrl: {
      type: "string",
      if: { minLength: 1 },
      then: { format: "uri" },
    },
  },
} as IConfigurationSchema;
