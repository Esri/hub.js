import { JSONSchema } from "json-schema-typed";
import { getSlugMaxLength } from "../../../items/_internal/slugs";
import { cloneObject } from "../../../util";
import { HubEntity } from "../../types/HubEntity";
import { IWithSlug } from "../../traits";
import { IConfigurationSchema } from "../types";
import { EditorOptions } from "./EditorOptions";

/**
 * add slug max length and unique validation to schema
 * based on the orgUrlKey
 * @param schema
 * @param options
 * @returns
 */
export const addDynamicSlugValidation = (
  schema: IConfigurationSchema,
  options: EditorOptions
): IConfigurationSchema => {
  const _slug = cloneObject(schema.properties?._slug) as JSONSchema;
  if (!_slug) {
    return schema;
  }
  // add max length to slug
  const { orgUrlKey } = options as IWithSlug;
  _slug.maxLength = getSlugMaxLength(orgUrlKey);
  // add conditional validation to ensure slug is unique
  const allOf = cloneObject(schema.allOf) || [];

  const { pattern } = _slug;
  // remove pattern from base schema so the form doesn't always apply the pattern
  // validation. We will add it back to the allOf conditionally
  delete _slug.pattern;

  const { id } = options as HubEntity;

  allOf.push(
    {
      // only enforce the pattern if slug has been entered
      if: { properties: { _slug: { minLength: 1 } } },
      then: { properties: { _slug: { pattern } } },
    },
    {
      // only do async isUniqueSlug check if the slug is valid
      if: { properties: { _slug: { pattern } } },
      then: {
        properties: { _slug: { isUniqueSlug: { id, orgUrlKey } } as any },
      },
    }
  );

  const clone = cloneObject(schema);
  clone.properties._slug = _slug;
  clone.allOf = allOf;
  return clone;
};
