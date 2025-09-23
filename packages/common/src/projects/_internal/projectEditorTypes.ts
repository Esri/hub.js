export type ProjectEditorType = (typeof ProjectEditorTypes)[number];

export const ProjectEditorTypes = [
  "hub:project:create",
  "hub:project:create2",
  "hub:project:edit",
  "hub:project:metrics",
  "hub:project:settings",
] as const;
