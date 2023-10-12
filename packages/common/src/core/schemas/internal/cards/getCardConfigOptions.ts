import { IArcGISContext } from "../../../..";
import { CardType, UiSchemaElementOptions } from "../../types";
import { ConfigurableCard } from "../ConfigurableEntity";
import { getCardType } from "./getCardType";

export async function getCardConfigOptions(
  type: CardType,
  config: ConfigurableCard = {},
  context: IArcGISContext
): Promise<UiSchemaElementOptions[]> {
  const cardType = getCardType(type);

  // Hash of options by card type
  const options: Record<string, UiSchemaElementOptions[]> = {
    stat: [
      {
        scope: "/properties/valueColor",
        options: {
          savedColors: config.themeColors,
        },
      },
    ],
  };

  return options[cardType] || [];
}
