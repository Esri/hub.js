import { IHubProjectEditor } from "./IHubProject";

/**
 * Unified type for all Hub entity editors
 */
export type HubEntityEditor = IHubProjectEditor; // | IHubSiteEditor | IHubInitiativeEditor | IHubPageEditor | IHubDiscussionEditor;

/**
 * Additional context that can be passed to `toEditor()` functions
 */
export interface IEntityEditorContext {
  // the concept of core/content groups might be going away in
  // the future, but we'll include for now
  collaborationGroupId?: string;
  contentGroupId?: string;
}
