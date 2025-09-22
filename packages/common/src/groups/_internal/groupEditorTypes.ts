export type GroupEditorType = (typeof GroupEditorTypes)[number];

export const GroupEditorTypes = [
  "hub:group:edit",
  "hub:group:settings",
  "hub:group:settings:discussions",
  // editor to create a followers group
  "hub:group:create:followers",
  // editor to create an association group
  "hub:group:create:association",
  "hub:group:create:view",
  "hub:group:create:edit",
  "hub:group:create",
] as const;
