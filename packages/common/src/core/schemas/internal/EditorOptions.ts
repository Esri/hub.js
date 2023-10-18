import { HubEntity } from "../../types";

/** Intersection type of all EditorOptions */
export type EditorOptions = EntityEditorOptions | CardEditorOptions;

/**
 * Generic interface for a Hub Entity
 */
export type EntityEditorOptions = Partial<HubEntity> & Record<string, any>;

/**
 * Generic interface for a layout card
 */
export type CardEditorOptions = Record<string, any>;
