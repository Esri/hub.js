import { IEditorConfig } from "../behaviors/IWithEditorBehavior";
import { IArcGISContext } from "../../ArcGISContext";
import { ConfigurableCard } from "./internal/ConfigurableEntity";
import { CardType } from "./types";
import { getCardEditorSchemas } from "./internal/getCardEditorSchemas";
import { getCardConfigOptions } from "./internal/getCardConfigOptions";

/**
 * Construct the editor configuration (schema + uiSchema)
 * for a given layout card editor
 * @param type 
 * @param context 
 */
export async function getCardConfig(
  i18nScope: string,
  type: CardType,
  config?: ConfigurableCard,
  context?: IArcGISContext
): Promise<IEditorConfig> {
  const options = await getCardConfigOptions(type, config, context);
  return getCardEditorSchemas(i18nScope, type, options)
}