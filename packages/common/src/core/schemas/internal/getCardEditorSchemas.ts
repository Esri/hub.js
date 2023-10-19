import { CardEditorType, IEditorConfig } from "../types";
import { getCardType } from "./getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { ICardEditorOptions } from "./EditorOptions";
import { cloneObject } from "../../../util";
import { IArcGISContext } from "../../..";

/**
 * get the editor schema and uiSchema defined for a layout card.
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor).
 *
 * @param i18nScope  translation scope to be interpolated into the uiSchema
 * @param type editor type - corresponds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 * @param context
 * @returns
 */
export async function getCardEditorSchemas(
  i18nScope: string,
  type: CardEditorType,
  options: ICardEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const cardType = getCardType(type);

  // schema and uiSchema are dynamically imported based
  // on the previous editor types

  let schema;
  let uiSchema;

  switch (cardType) {
    case "stat":
      // get correct module
      const schemaPromise = import("./metrics/MetricSchema");
      const uiSchemaPromise = {
        "hub:card:stat": () => import("./metrics/StatCardUiSchema"),
      }[type as CardEditorType];

      // Allow imports to run in parallel
      await Promise.all([schemaPromise, uiSchemaPromise()]).then(
        ([schemaModuleResolved, statModuleResolved]) => {
          const { MetricSchema } = schemaModuleResolved;
          schema = cloneObject(MetricSchema);
          uiSchema = statModuleResolved.buildUiSchema(
            i18nScope,
            options,
            context
          );
        }
      );
      break;
  }
  // filter out properties not used in uiSchema
  schema = filterSchemaToUiSchema(schema, uiSchema);

  return Promise.resolve({ schema, uiSchema });
}
