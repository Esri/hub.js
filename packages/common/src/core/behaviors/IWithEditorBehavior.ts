import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
  EditorType,
} from "../schemas";

/**
 * DEPRECATED: the following will be removed at next breaking version
 * we will be shifting towards the EditorType defined in the schemas
 * directory
 */
export type EditorConfigType = "create" | "edit";

export interface IEditorConfig {
  schema: IConfigurationSchema;
  uiSchema: IUiSchema;
}

/**
 *
 */
export interface IWithEditorBehavior {
  getEditorConfig(
    i18nScope: string,
    type: EditorType,
    options: UiSchemaElementOptions[]
  ): Promise<IEditorConfig>;
}
