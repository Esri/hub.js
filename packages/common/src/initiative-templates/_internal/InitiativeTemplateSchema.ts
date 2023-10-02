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
    previewUrl: { type: "string", format: "url" },
  },
  // we have to do this to allow the format: url to pass through
} as unknown as IConfigurationSchema;
