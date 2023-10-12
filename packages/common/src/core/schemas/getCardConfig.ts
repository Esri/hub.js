import { CardType, IEditorConfig, IArcGISContext } from "../..";
import { getCardConfigOptions } from "./internal/cards/getCardConfigOptions";
import { ConfigurableCard } from "./internal/ConfigurableEntity";
import { getCardEditorSchemas } from "./internal/getCardEditorSchemas";

/**
 * Construct the Editor Configuration (schema + uiSchema)
 * for a given layout card type
 * @param i18nScope
 * @param type
 * @param config
 * @param context
 */
export async function getCardConfig(
  i18nScope: string,
  type: CardType,
  config: ConfigurableCard,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const options = await getCardConfigOptions(type, config, context);
  return getCardEditorSchemas(i18nScope, type, options);
}
