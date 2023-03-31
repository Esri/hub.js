import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValueDefinition,
  DynamicValueResult,
} from "../../core/types/DynamicValues";
import { resolveDynamicValue } from "./resolveDynamicValue";

/**
 * @internal
 * Resolve a set of dynamic values.
 * The individual definitions can be of many types (item-query, portal etc), each of which has their own logic for resolving the value.
 * @param dynamicValues Array of dynamic value definitions to resolve
 * @param context ArcGIS context of the current user.
 * @returns
 */
export const resolveDynamicValues = async (
  dynamicValues: DynamicValueDefinition[],
  context: IArcGISContext
): Promise<Record<string, DynamicValueResult>> => {
  let result: Record<string, any> = {};

  for (const valueDef of dynamicValues) {
    const val = await resolveDynamicValue(valueDef, context);
    result = { ...result, ...val };
  }

  return result;
};
