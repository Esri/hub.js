import { IEditorConfig } from "../../behaviors";
import { CardType, IConfigurationSchema } from "../types";
import { getCardType } from "./getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { ConfigurableCard } from "./ConfigurableEntity";
import { cloneObject } from "../../../util";
import { IArcGISContext } from "../../..";

export async function getCardEditorSchemas(
  i18nScope: string,
  type: CardType,
  config: ConfigurableCard,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const cardType = getCardType(type);

  // schema and uiSchema are dynamically imported based
  // on the previous editor types

  let schema;
  let uiSchema;

  switch (cardType) {
    case "stat":
      const { StatSchema } = await import("./metrics/StatCardSchema");
      schema = cloneObject(StatSchema);

      const statModule = await {
        "hub:card:stat": () => import("./metrics/StatCardUiSchema"),
      }[type as CardType]();
      uiSchema = statModule.buildUiSchema(i18nScope, config, context);

      break;
  }

  // filter out properties not used in uiSchema
  schema = filterSchemaToUiSchema(schema as IConfigurationSchema, uiSchema);

  return Promise.resolve({ schema, uiSchema });
}
