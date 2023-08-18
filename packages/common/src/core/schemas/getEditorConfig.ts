import { IEditorConfig } from "../behaviors/IWithEditorBehavior";
import { IArcGISContext } from "../../ArcGISContext";
import { ConfigurableEntity } from "./internal/ConfigurableEntity";
import { getEditorConfigOptions } from "./internal/getEditorConfigOptions";
import { getEntityEditorSchemas } from "./internal/getEntityEditorSchemas";
import { EditorType } from "./types";

/**
 * Construct the editor configuration (schema + uiSchema)
 * for a given entity editor
 * @param i18nScope
 * @param type
 * @param entity
 * @param context
 */
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType,
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const options = await getEditorConfigOptions(type, entity, context);
  return getEntityEditorSchemas(i18nScope, type, options);
}
