import { HubEntity } from "../../types";

/** Intersection type of all EditorOptions */
export type EditorOptions = IEntityEditorOptions | ICardEditorOptions;

/**
 * Options to use when constructing a schema and uiSchema for
 * an entity's editor. Often times, this can just be the entity
 * object itself.
 */
export type IEntityEditorOptions = Partial<HubEntity> & Record<string, any>;

/**
 * Options to use when constructing a schema and uiSchema for
 * a layout card.
 */
export interface ICardEditorOptions {
  themeColors?: string[];
}
