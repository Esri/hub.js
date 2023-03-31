import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValueDefinition,
  DynamicValueResult,
  IDynamicItemQueryDefinition,
  IDynamicPortalQueryDefinition,
  IDynamicServiceQueryDefinition,
} from "../../core/types/DynamicValues";
import { getProp } from "../../objects/get-prop";
import { resolveItemQueryValues } from "./resolveItemQueryValues";
import { resolvePortalValues } from "./resolvePortalValues";
import { resolveServiceQueryValues } from "./resolveServiceQueryValues";

/**
 * @internal
 * Resolve a single dynamic value. If the result is a DynamicValueDefinition, it will be resolved recursively.
 */

export async function resolveDynamicValue(
  valueDef: DynamicValueDefinition,
  context: IArcGISContext
): Promise<Record<string, DynamicValueResult>> {
  let result: Record<string, any> = {};
  switch (valueDef.type) {
    case "static-value":
      const val = getProp(valueDef, "value");
      const outPath = getProp(valueDef, "outPath");
      result[outPath] = val;
      break;
    case "item-query":
      result = await resolveItemQueryValues(
        valueDef as IDynamicItemQueryDefinition,
        context
      );
      break;
    case "portal":
      result = await resolvePortalValues(
        valueDef as IDynamicPortalQueryDefinition,
        context
      );
      break;
    case "service-query":
      result = await resolveServiceQueryValues(
        valueDef as IDynamicServiceQueryDefinition,
        context
      );
      break;
    default:
      throw new Error(`Cannot resolve value - unexpected source.`);
  }
  return result;
}
