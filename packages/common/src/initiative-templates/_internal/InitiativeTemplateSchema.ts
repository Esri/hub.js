import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type InitiativeTemplateEditorType =
  (typeof InitiativeTemplateEditorTypes)[number];

export const InitiativeTemplateEditorTypes = [
  "hub:initiativeTemplate:edit",
] as const;

export const InitiativeTemplateSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
    previewUrl: {
      type: "string",
      if: { minLength: 1 },
      then: { format: "uri" },
    },
    recommendedTemplates: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  // we have to do this to allow the format: url to pass through
} as IConfigurationSchema;
