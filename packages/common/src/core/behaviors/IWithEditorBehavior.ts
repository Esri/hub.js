import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
  EditorType,
} from "../schemas";

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
