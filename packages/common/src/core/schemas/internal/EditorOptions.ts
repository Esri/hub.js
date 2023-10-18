import { HubEntity } from "../../types";

/** Intersection type of all EditorOptions */
export type EditorOptions = IEntityEditorOptions | ICardEditorOptions;

/**
 * Generic interface for a Hub Entity
 */
export type IEntityEditorOptions = Partial<HubEntity> & Record<string, any>;

/**
 * Generic interface for a layout card
 */
export interface ICardEditorOptions {
  themeColors: string[];
}
