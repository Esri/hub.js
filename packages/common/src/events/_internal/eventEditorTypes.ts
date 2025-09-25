export type EventEditorType = (typeof EventEditorTypes)[number];

export const EventEditorTypes = [
  "hub:event:create",
  "hub:event:edit",
  "hub:event:registrants",
] as const;
