import { IConfigurationSchema, IUiSchema, EditorType } from "../schemas";
import { HubEntity, HubEntityEditor, IEntityEditorContext } from "../types";

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
  getEditorConfig(i18nScope: string, type: EditorType): Promise<IEditorConfig>;

  /**
   * Convert the entity into it's "Editor" structure.
   * This should only be used by the arcgis-hub-entity-editor component.
   * For general use, see the `toJson():<T>` method
   */
  toEditor(
    editorContext: IEntityEditorContext,
    include?: string[]
  ): Promise<HubEntityEditor>;

  /**
   * Update the internal Entity from the "Editor" structure.
   * This should only be used by the arcgis-hub-entity-editor component.
   * For general use, see the `update(Partial<T>)` method
   * @param values
   */
  fromEditor(editor: HubEntityEditor): Promise<HubEntity>;
}
