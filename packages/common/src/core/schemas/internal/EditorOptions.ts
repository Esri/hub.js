import { HubEntity } from "../../types";

/** Intersection type of all EditorOptions */
export type EditorOptions = EntityEditorOptions | CardEditorOptions;

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
export type CardEditorOptions =
  | IStatCardEditorOptions
  | IFollowCardEditorOptions
  | IEventGalleryCardEditorOptions;

/**
 * Options to use when constructing a schema and uiSchema for
 * a stat card editor.
 */
export interface IStatCardEditorOptions {
  themeColors: string[];
}

/**
 * Options to use when constructing a schema and uiSchema for
 * a follow card editor.
 */
export interface IFollowCardEditorOptions {}

/**
 * Options to use when constructing a schema and uiSchema for
 * an event gallery card editor.
 */
export interface IEventGalleryCardEditorOptions {
  tags: string[];
}
