import { HubEntity } from "../../types";

/** Intersection type of all EditorOptions */
export type EditorOptions = EntityEditorOptions | CardEditorOptions;

// but once I added IHubUser to HubEntity I would get errors
// about isSharedUpdate not existing on IHubUser
// which is odd b/c it only exists on IHubGroup
// so, for now, I'm using a union type that excludes IHubUser
/**
 * Options to use when constructing a schema and uiSchema for
 * an entity's editor. Often times, this can just be the entity
 * object itself.
 *
 * However, it must always have "type" on the options, even if not the entire entity.
 */
export type EntityEditorOptions = HubEntity;

/**
 * Options to use when constructing a schema and uiSchema for
 * a layout card's editor. This should be a union of all of the different
 * layout card editor options, i.e. IStatCardEditorOptions | ICountdownCardEditorOptions | ...
 */
export type CardEditorOptions = IStatCardEditorOptions;

/**
 * Options to use when constructing a schema and uiSchema for
 * a stat card editor.
 */
export interface IStatCardEditorOptions {
  themeColors: string[];
}
