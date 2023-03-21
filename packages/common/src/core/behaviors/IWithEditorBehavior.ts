import { EditorType } from "../schemas/internal/getEditorConfig";
import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
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
