import { IEditorConfig } from ".";
import { IArcGISContext } from "../../ArcGISContext";
import { EditorOptions } from "./internal/EditorOptions";
import { getEditorSchemas } from "./internal/getEditorSchemas";
import {
  CardEditorType,
  EditorType,
  EntityEditorType,
  validCardEditorTypes,
} from "./types";
import { getCardEditorSchemas } from "./internal/getCardEditorSchemas";

/**
 * Construct the Editor Configuration (schema + uiSchema)
 * for a given entity editor type
 * @param i18nScope
 * @param type
 * @param options
 * @param context
 * @returns
 */
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType, // make this into an intersection type vs. either or
  options: EditorOptions, //
  context: IArcGISContext
): Promise<IEditorConfig> {
  return getEditorSchemas(i18nScope, type, options, context);
}
