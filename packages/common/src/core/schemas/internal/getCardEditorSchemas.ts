import { cloneObject } from "../../../util";
import { IEditorConfig } from "../../behaviors/IWithEditorBehavior";
import { CardType, IConfigurationSchema, UiSchemaElementOptions } from "../types";
import { applyUiSchemaElementOptions } from "./applyUiSchemaElementOptions";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { interpolate } from "../../../items/interpolate";
/**
 * get the editor schema and uiSchema defined for an layout card.
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor)
 *
 * @param i18nScope translation scope to be interpolated into the uiSchema
 * @param type editor type - corresonds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 */
export async function getCardEditorSchemas(
  i18nScope: string,
  type: CardType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> {
  const cardType = type.split(":")[2];

  // schema and uiSchema are dynamically imported based on
  // the provided editor type
  let schema;
  let uiSchema;
  switch (cardType) {
    case "stat":
      const { MetricSchema } = await import('../metrics/MetricSchema');
      schema = cloneObject(MetricSchema);
      ({ uiSchema } = await import('./cards/StatCardUiSchema'));
      break;
    case "countdown":
      const { CountdownSchema } = await import('./cards/CountdownSchema');
      schema = cloneObject(CountdownSchema);
      ({ uiSchema } = await import('./cards/CountdownCardUiSchema'));
      break;
  }

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema as IConfigurationSchema, uiSchema);
  // apply the options
  uiSchema = applyUiSchemaElementOptions(uiSchema, options);
  // interpolate the i18n scope into the uiSchema
  uiSchema = interpolate(
    uiSchema,
    { i18nScope },
    // We don't have a real i18n object here, so just return the key
    {
      translate(i18nKey: string) {
        return `{{${i18nKey}:translate}}`;
      },
    }
  );

  return Promise.resolve({ schema, uiSchema });
}
