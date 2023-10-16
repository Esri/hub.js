import { IEditorConfig } from "../behaviors/IWithEditorBehavior";
import { IArcGISContext } from "../../ArcGISContext";
import {
  ConfigurableCard,
  ConfigurableEntity,
} from "./internal/ConfigurableEntity";
import { getEntityEditorSchemas } from "./internal/getEntityEditorSchemas";
import { CardType, EditorType, validCardTypes } from "./types";
import { getCardEditorSchemas } from "./internal/getCardEditorSchemas";

/**
 * Construct the Editor Configuration (schema + uiSchema)
 * for a given entity editor type
 * @param i18nScope
 * @param type
 * @param entity
 * @param context
 * @returns
 */
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType | CardType,
  config: ConfigurableEntity | ConfigurableCard,
  context: IArcGISContext
): Promise<IEditorConfig> {
  return validCardTypes.includes(type as CardType)
    ? getCardEditorSchemas(i18nScope, type as CardType, config, context)
    : getEntityEditorSchemas(i18nScope, type as EditorType, config, context);
}
