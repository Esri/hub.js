import { HubEntity } from "../../types/HubEntity";

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
  | StatCardEditorOptions
  | FollowCardEditorOptions
  | EventGalleryCardEditorOptions
  | EmbedCardEditorOptions;

/**
 * Options to use when constructing a schema and uiSchema for
 * a stat card editor.
 */
export interface StatCardEditorOptions {
  themeColors: string[];
}

/**
 * Options to use when constructing a schema and uiSchema for
 * a follow card editor.
 */
export type FollowCardEditorOptions = Record<string, never>;

/**
 * Options to use when constructing a schema and uiSchema for
 * an event gallery card editor.
 */
export interface EventGalleryCardEditorOptions {
  tags: string[];
}

/**
 * Options to use when constructing a schema and uiSchema for
 * an embed card editor.
 */
export type EmbedCardEditorOptions = Record<string, never>;
