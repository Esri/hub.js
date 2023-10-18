import { IEditorConfig } from ".";
import { IArcGISContext } from "../../ArcGISContext";
import { EditorOptions } from "./internal/EditorOptions";
import { getEntityEditorSchemas } from "./internal/getEntityEditorSchemas";
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
  return validCardEditorTypes.includes(type as CardEditorType)
    ? getCardEditorSchemas(i18nScope, type as CardEditorType, options, context)
    : getEntityEditorSchemas(
        i18nScope,
        type as EntityEditorType,
        options,
        context
      );
}
