import { IConfigurationSchema } from "../../core";
import { HubItemEntitySchema } from "../../core/schemas/shared/HubItemEntitySchema";

export type InitiativeTemplateEditorType =
  (typeof InitiativeTemplateEditorTypes)[number];

export const InitiativeTemplateEditorTypes = [
  "hub:initiativeTemplate:edit",
  "hub:initaitiveTemplate:create",
] as const;

export const InitiativeTemplateSchema: IConfigurationSchema = {
  ...HubItemEntitySchema,
  properties: {
    ...HubItemEntitySchema.properties,
  },
} as IConfigurationSchema;
