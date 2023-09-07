import { IEditorConfig } from "../behaviors/IWithEditorBehavior";
import { IArcGISContext } from "../../ArcGISContext";
import { ConfigurableEntity } from "./internal/ConfigurableEntity";
import { getEntityEditorSchemas } from "./internal/getEntityEditorSchemas";
import { EditorType } from "./types";

/**
 * Construct the Editor Configuration for a given entity type
 * @param i18nScope
 * @param type
 * @param entity
 * @param context
 * @returns
 */
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType,
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<IEditorConfig> {
  return getEntityEditorSchemas(i18nScope, type, entity, context);
}
