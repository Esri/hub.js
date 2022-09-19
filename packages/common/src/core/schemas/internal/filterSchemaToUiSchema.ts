import { getUiSchemaProps } from "./getUiSchemaProps";
import { IConfigurationSchema, IUiSchema } from "../types";
import { subsetSchema } from "./subsetSchema";

/**
 * Subset a json schema to only those properties needed by the uiSchema
 * @param schema
 * @param uiSchema
 * @returns
 */
export function filterSchemaToUiSchema(
  schema: IConfigurationSchema,
  uiSchema: IUiSchema
): IConfigurationSchema {
  const propsToKeep = getUiSchemaProps(uiSchema);
  schema = subsetSchema(schema, propsToKeep);
  return schema;
}
