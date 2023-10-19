import { IEditorConfig } from "./types";
import { IArcGISContext } from "../../ArcGISContext";
import { EditorOptions } from "./internal/EditorOptions";
import { getEditorSchemas } from "./internal/getEditorSchemas";
import { EditorType } from "./types";

/**
 * Construct the Editor Configuration (schema + uiSchema)
 * for a given entity editor type
 * @param i18nScope
 * @param type
 * @param options - options to integrate into the schema + uiSchema
 * @param context
 * @returns
 */
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType,
  options: EditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig> {
  return getEditorSchemas(i18nScope, type, options, context);
}
