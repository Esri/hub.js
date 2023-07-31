import { IArcGISContext } from "../../../ArcGISContext";
import { UiSchemaElementOptions } from "../types";
import { ConfigurableEntity } from "./ConfigurableEntity";
import { ConfigOption, configHelpers } from "./configOptionHelpers";

/**
 * Process the requested configuration options and return the results
 * @param options
 * @param entity
 * @param context
 * @returns
 */

export async function getConfigOptions(
  options: ConfigOption[],
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions[]> {
  const prms = options.map((option) => {
    return configHelpers[option](entity, context);
  });
  return Promise.all(prms);
}
