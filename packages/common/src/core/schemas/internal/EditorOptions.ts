/** Intersection type of all EditorOptions */
export type EditorOptions = EntityEditorOptions | CardEditorOptions;

/**
 * Generic interface for a Hub Entity
 */
export type EntityEditorOptions = Record<string, any>;

/**
 * Generic interface for a layout card
 */
export type CardEditorOptions = Record<string, any>;
