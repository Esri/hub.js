/**
 * Unified type for all Hub entity editors
 */
export type HubEntityEditor = Record<string, any>; // IHubProjectEditor; // | IHubSiteEditor | IHubInitiativeEditor | IHubPageEditor | IHubDiscussionEditor;

/**
 * Additional context that can be passed to `toEditor()` functions
 */
export interface IEntityEditorContext {
  // represents the current metric id being edited in the editor experience.
  metricId?: string;
  // represents the current metric display being edited in the editor experience.
  displayIndex?: number;
}
