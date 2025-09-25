export type ContentEditorType = (typeof ContentEditorTypes)[number];

export const ContentEditorTypes = [
  "hub:content:edit",
  "hub:content:settings",
  "hub:content:settings:discussions",
  "hub:content:settings:discussions:compact",
] as const;
