import { IEditorConfig } from "../behaviors";
import { EditorType } from "./types";
import { HubEntity } from "../types";
import { IArcGISContext, getEditorConfig } from "../..";

/**
 * DEPRECATED: please use getEditorConfig instead
 * get the editor schema and uiSchema defined for an entity.
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor)
 *
 * @param i18nScope translation scope to be interpolated into the uiSchema
 * @param type editor type - corresonds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 * @returns
 */
export const getEntityEditorSchemas = async (
  i18nScope: string,
  type: EditorType,
  entity: HubEntity,
  context: IArcGISContext
): Promise<IEditorConfig> => {
  return getEditorConfig(i18nScope, type, entity, context);
};
