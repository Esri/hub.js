import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
} from "../schemas";

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
    type: EditorConfigType,
    options: UiSchemaElementOptions[]
  ): Promise<IEditorConfig>;
}
