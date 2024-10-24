import { JSONSchema } from "json-schema-typed";
import { cloneObject } from "../../../util";
import { HubEntity } from "../../types/HubEntity";
import { IWithSlug } from "../../traits";
import { IConfigurationSchema } from "../types";
import { EditorOptions } from "./EditorOptions";

export const addConditionalSlugValidation = (
  schema: IConfigurationSchema,
  options: EditorOptions
): IConfigurationSchema => {
  // if schema has slug add conditional validation
  const _slug = schema.properties?._slug as JSONSchema;
  if (!_slug) {
    return schema;
  }
  const allOf = cloneObject(schema.allOf) || [];
  const { pattern } = _slug;
  const { orgUrlKey } = options as IWithSlug;
  const { id } = options as HubEntity;
  allOf.push({
    // only do async isUniqueSlug check if the slug is valid
    if: { properties: { _slug: { pattern } } },
    then: { properties: { _slug: { isUniqueSlug: { id, orgUrlKey } } as any } },
  });
  return { ...cloneObject(schema), allOf };
};
