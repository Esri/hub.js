import { CardEditorType, IEditorConfig, StatCardEditorType } from "../types";
import { getCardType } from "./getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { CardEditorOptions } from "./EditorOptions";
import { cloneObject } from "../../../util";
import { IArcGISContext } from "../../../ArcGISContext";

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
  options: CardEditorOptions,
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
        "hub:card:metric": () => import("./metrics/MetricUiSchema"),
      }[type as StatCardEditorType];

      // Allow imports to run in parallel
      await Promise.all([schemaPromise, uiSchemaPromise()]).then(
        ([schemaModuleResolved, uiSchemaModuleResolved]) => {
          const { MetricSchema } = schemaModuleResolved;
          schema = cloneObject(MetricSchema);
          uiSchema = uiSchemaModuleResolved.buildUiSchema(
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
