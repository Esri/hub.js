import {
  IEditorConfig,
  ActionLinksFieldEditorType,
  FieldEditorType,
} from "../types";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
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
export async function getFieldEditorSchemas(
  i18nScope: string,
  type: FieldEditorType,
  options: any,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const fieldType = type && type.split(":")[2];

  // schema and uiSchema are dynamically imported based
  // on the previous editor types

  let schema;
  let uiSchema;
  let schemaPromise;
  let uiSchemaPromise;

  switch (fieldType) {
    case "actionLinks":
      // get correct module
      schemaPromise = import("./actionLinks/ActionLinksSchema");
      uiSchemaPromise = {
        "hub:field:actionLinks:card": () => import("./actionLinks/ActionCardUiSchema"),
        "hub:field:actionLinks:projectCallToAction": () => import("./actionLinks/ProjectUiSchemaCallToAction"),
      }[type as ActionLinksFieldEditorType];

      // Allow imports to run in parallel
      await Promise.all([schemaPromise, uiSchemaPromise()]).then(
        ([schemaModuleResolved, uiSchemaModuleResolved]) => {
          const { ActionLinksSchema } = schemaModuleResolved;
          schema = cloneObject(ActionLinksSchema);
          uiSchema = uiSchemaModuleResolved.buildUiSchema(
            i18nScope,
            options as any,
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
