export type SiteEditorType = (typeof SiteEditorTypes)[number];

export const SiteEditorTypes = [
  "hub:site:edit",
  "hub:site:create",
  "hub:site:followers",
  "hub:site:settings",
  "hub:site:assistant",
  "hub:site:settings:discussions",
] as const;
