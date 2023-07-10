import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
  EditorType,
} from "../schemas";
import { HubEntityEditor } from "../types";

export interface IEditorConfig {
  schema: IConfigurationSchema;
  uiSchema: IUiSchema;
}

/**
 * Functions that are used by the arcgis-hub-entity-editor component
 */
export interface IWithEditorBehavior {
  /**
   * Get the Entity's ui and schema for the editor
   * @param i18nScope
   * @param type
   * @param options
   */
  getEditorConfig(
    i18nScope: string,
    type: EditorType,
    options: UiSchemaElementOptions[]
  ): Promise<IEditorConfig>;

  /**
   * Convert the entity into it's "Editor" structure.
   * This should only be used by the arcgis-hub-entity-editor component.
   * For general use, see the `toJson():<T>` method
   */
  toEditor(): HubEntityEditor;

  /**
   * Update the internal Entity from the "Editor" structure.
   * This should only be used by the arcgis-hub-entity-editor component.
   * For general use, see the `update(Partial<T>)` method
   * @param values
   */
  fromEditor(editor: HubEntityEditor): Promise<void>;
}
