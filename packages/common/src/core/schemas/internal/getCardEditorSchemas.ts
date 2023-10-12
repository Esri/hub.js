import { IEditorConfig } from "../../behaviors";
import {
  CardType,
  IConfigurationSchema,
  UiSchemaElementOptions,
} from "../types";
import { getCardType } from "./cards/getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { applyUiSchemaElementOptions } from "./applyUiSchemaElementOptions";
import { interpolate } from "../../../items";

export async function getCardEditorSchemas(
  i18nScope: string,
  type: CardType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> {
  const cardType = getCardType(type);

  // schema and uiSchema are dynamically imported based
  // on the previous editor types

  let schema;
  let uiSchema;

  switch (cardType) {
    case "stat":
      // TODO: add schema imports here
      break;
  }

  // filter out properties not used in uiSchema
  schema = filterSchemaToUiSchema(schema as IConfigurationSchema, uiSchema);
  // apply the options
  uiSchema = applyUiSchemaElementOptions(uiSchema, options);
  // interpolate the i18nScope into the uiSchema
  uiSchema = interpolate(
    uiSchema,
    { i18nScope },
    // No real i18n object here, so just return key
    {
      translate(i18nKey: string) {
        return `{{${i18nKey}: translate}}`;
      },
    }
  );

  // TODO: may need to interpolate schema as well, if enums...
  // but that might just be in service-query-metric field instead

  return Promise.resolve({ schema, uiSchema });
}
