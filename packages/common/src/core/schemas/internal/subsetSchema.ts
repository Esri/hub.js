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

  // 1. remove un-specified properties from the "required" array
  if (subset.required) {
    subset.required = [...subset.required].filter((required) =>
      props.includes(required)
    );
  }

  // 2. filter the rest of the schema down to the specified properties
  if (subset.properties) {
    Object.keys(subset.properties).forEach((key) => {
      if (props.indexOf(key) === -1) {
        delete subset.properties[key];
      }
    });
  }

  // 3. filter schema compositions (anyOf, allOf, oneOf) down
  // to specified properties

  if (subset.allOf) {
    subset.allOf = subset.allOf.map((s) =>
      subsetSchema(s as IConfigurationSchema, props)
    );
  }

  if (subset.if) {
    subset.if = subsetSchema(subset.if as IConfigurationSchema, props);
  }

  if (subset.then) {
    subset.then = subsetSchema(subset.then as IConfigurationSchema, props);
  }

  if (subset.else) {
    subset.else = subsetSchema(subset.else as IConfigurationSchema, props);
  }
  return subset;
}
