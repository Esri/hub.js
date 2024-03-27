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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      then: { format: "url" },
    },
    recommendedTemplates: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  // we have to do this to allow the format: url to pass through
};
