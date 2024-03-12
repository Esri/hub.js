import {
  CardEditorType,
  IEditorConfig,
  StatCardEditorType,
  FollowCardEditorType,
} from "../types";
import { getCardType } from "./getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { CardEditorOptions } from "./EditorOptions";
import { cloneObject } from "../../../util";
import { IArcGISContext } from "../../../ArcGISContext";
import { ICardEditorModuleType } from "../types";

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
  let schemaPromise;
  let uiSchemaPromise;
  let defaults;

  switch (cardType) {
    case "stat":
      // get correct module
      schemaPromise = import("./metrics/MetricSchema");
      uiSchemaPromise = {
        "hub:card:stat": () => import("./metrics/StatCardUiSchema"),
      }[type as StatCardEditorType];

      // Allow imports to run in parallel
      await Promise.all([schemaPromise, uiSchemaPromise()]).then(
        async ([schemaModuleResolved, uiSchemaModuleResolved]) => {
          const { MetricSchema } = schemaModuleResolved;
          schema = cloneObject(MetricSchema);
          uiSchema = await uiSchemaModuleResolved.buildUiSchema(
            i18nScope,
            options,
            context
          );

          // if we have buildDefaults, build the defaults
          // TODO: when first implementing buildDefaults for initiative templates, remove the ignore line

          /* istanbul ignore next */
          if ((uiSchemaModuleResolved as ICardEditorModuleType).buildDefaults) {
            defaults = (
              uiSchemaModuleResolved as ICardEditorModuleType
            ).buildDefaults(i18nScope, options, context);
          }
        }
      );

      break;
    case "follow":
      // get correct module
      schemaPromise = import("./follow/FollowSchema");
      uiSchemaPromise = {
        "hub:card:follow": () => import("./follow/FollowCardUiSchema"),
      }[type as FollowCardEditorType];

      // Allow imports to run in parallel
      await Promise.all([schemaPromise, uiSchemaPromise()]).then(
        ([schemaModuleResolved, uiSchemaModuleResolved]) => {
          const { FollowSchema: FollowSchema } = schemaModuleResolved;
          schema = cloneObject(FollowSchema);
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
