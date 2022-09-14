import { cloneObject } from "../../../util";
import { IConfigurationSchema } from "../types";

/**
 * Subset a json schema to only those properties specified.
 * @param schema
 * @param props
 * @returns
 */
export function subsetSchema(
  schema: IConfigurationSchema,
  props: string[]
): IConfigurationSchema {
  const subset: IConfigurationSchema = cloneObject(schema);
  Object.keys(subset.properties).forEach((key) => {
    if (props.indexOf(key) === -1) {
      delete subset.properties[key];
    }
  });
  return subset;
}
