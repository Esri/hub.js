export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];

export const InitiativeEditorTypes = [
  "hub:initiative:edit",
  "hub:initiative:create",
  "hub:initiative:create2",
  "hub:initiative:metrics",
  "hub:initiative:associations",
  "hub:initiative:settings",
] as const;
