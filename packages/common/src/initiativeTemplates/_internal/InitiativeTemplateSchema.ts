export type InitiativeTemplateEditorType =
  (typeof InitiativeTemplateEditorTypes)[number];
export const InitiativeTemplateEditorTypes = [
  "hub:initiativeTemplate:create",
  "hub:initiativeTemplate:edit",
] as const;
