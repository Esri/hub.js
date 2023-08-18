import { CardType, UiSchemaElementOptions } from "../types";
import { IArcGISContext } from "../../../ArcGISContext";
import { ConfigurableCard } from "./ConfigurableEntity";

/**
 * Construc the editor configuration optionsfor a give layout card
 * @param type
 * @param entity
 * @param context
 */
export async function getCardConfigOptions(
  type: CardType,
  config: ConfigurableCard = {},
  _context: IArcGISContext
): Promise<UiSchemaElementOptions[]> {
  console.log('GET CARD CONFIG OPTIONS >>>>', type, config);
  const cardType = type.split(":")[2];

  // Hash of options by card type
  const options: Record<string, UiSchemaElementOptions[]> = {
    stat: [{
      scope: "/properties/valueColor",
      options: {
        savedColors: config.themeColors
      }
    }]
  };

  return options[cardType] || [];
}
