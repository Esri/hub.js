import { IEditorConfig } from ".";
import { IArcGISContext } from "../../ArcGISContext";
import { EditorOptions } from "./internal/ConfigurableEntity";
import { getEntityEditorSchemas } from "./internal/getEntityEditorSchemas";
import { CardType, EditorType, validCardTypes } from "./types";
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
  type: EditorType | CardType, // make this into an intersection type vs. either or
  options: EditorOptions, //
  context: IArcGISContext
): Promise<IEditorConfig> {
  return validCardTypes.includes(type as CardType)
    ? getCardEditorSchemas(i18nScope, type as CardType, options, context)
    : getEntityEditorSchemas(i18nScope, type as EditorType, options, context);
}
