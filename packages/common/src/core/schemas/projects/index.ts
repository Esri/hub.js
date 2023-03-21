export * from "./schema";
export { uiSchema as HubProjectCreateUiSchema } from "./uiSchemas/create";
export { uiSchema as HubProjectEditUiSchema } from "./uiSchemas/edit";

export type HubProjectEditorConfigType = "create" | "edit";
