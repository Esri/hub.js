import { deepGetPropValues } from "../../../objects/deepGetPropValues";
import { IUiSchema } from "../types";

/**
 * Get all the property names from a UI schema.
 *
 * Used to subset a json schema to only those properties used in a UI Schema
 * @param uiSchema
 * @returns
 */
export function getUiSchemaProps(uiSchema: IUiSchema): string[] {
  return deepGetPropValues(uiSchema, "scope").map((scope: string) => {
    return scope.split("/").pop();
  });
}
