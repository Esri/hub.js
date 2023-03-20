import {
  IConfigurationSchema,
  IUiSchema,
  UiSchemaElementOptions,
  HubProjectEditorConfigType,
  HubInitiativeEditorConfigType,
} from "../schemas";

export type EditorConfigType =
  | HubProjectEditorConfigType
  | HubInitiativeEditorConfigType;

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
