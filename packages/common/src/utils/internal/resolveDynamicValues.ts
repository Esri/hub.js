import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValueDefinition,
  IDynamicValueOutput,
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
): Promise<Record<string, IDynamicValueOutput>> => {
  let result: Record<string, any> = {};

  // iterate over the dynamic values and resolve each one via Promise.all
  // this will allow us to resolve all the values in parallel
  const resolvedValues = await Promise.all(
    dynamicValues.map((valueDef) => resolveDynamicValue(valueDef, context))
  );
  // merge the resolved values into a single object
  result = resolvedValues.reduce((acc, val) => ({ ...acc, ...val }), {});

  return result;
};
