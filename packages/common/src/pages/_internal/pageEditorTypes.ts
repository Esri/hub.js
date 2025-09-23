export const PageEditorTypes = ["hub:page:edit", "hub:page:create"] as const;

export type PageEditorType = (typeof PageEditorTypes)[number];
