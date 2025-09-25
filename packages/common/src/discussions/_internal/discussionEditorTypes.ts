export type DiscussionEditorType = (typeof DiscussionEditorTypes)[number];

export const DiscussionEditorTypes = [
  "hub:discussion:edit",
  "hub:discussion:create",
  "hub:discussion:settings",
  "hub:discussion:settings:discussions",
] as const;
