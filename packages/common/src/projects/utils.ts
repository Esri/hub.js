import { IItem, searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { cloneObject, dasherize, deepSet, getProp, IModel } from "..";
/**
 * Create a slug, namespaced to an org
 * Typically used to lookup items by a human readable name in urls
 *
 * @param title
 * @param orgKey
 * @returns
 */
export function createSlug(title: string, orgKey: string) {
  return `${orgKey.toLowerCase()}-${dasherize(title)}`;
}

/**
 * Adds/Updates the slug typekeyword
 * Returns a new array of keywords
 * @param typeKeywords
 * @param slug
 * @returns
 */
export function setSlugKeyword(typeKeywords: string[], slug: string): string[] {
  // remove slug entry from array
  const removed = typeKeywords.filter((entry: string) => {
    return !entry.startsWith("slug|");
  });

  // now add it
  removed.push(`slug|${slug}`);
  return removed;
}

export interface IPropertyMap {
  objectKey: string;
  modelKey: string;
}

/**
 * Generic function to apply properties from an Object
 * (i.e. IHubProject) onto a Model that can be persisted to an Item
 * @param object
 * @param model
 * @param mappings
 * @returns
 */
export function mapObjectToModel<T>(
  object: T,
  model: IModel,
  mappings: IPropertyMap[]
): IModel {
  return mapProps(object, "objectKey", model, "modelKey", mappings);
}

/**
 * Generic function to apply properties from a Model
 * onto an Object (i.e. IHubProject etc)
 * @param model
 * @param object
 * @param mappings
 * @returns
 */
export function mapModelToObject<T>(
  model: IModel,
  object: T,
  mappings: IPropertyMap[]
): T {
  return mapProps(model, "modelKey", object, "objectKey", mappings);
}

/**
 * Internal function to map between objects
 * @param source
 * @param sourceKey
 * @param target
 * @param targetKey
 * @param mappings
 * @returns
 */
function mapProps<S, T>(
  source: S,
  sourceKey: string,
  target: T,
  targetKey: string,
  mappings: IPropertyMap[]
): T {
  // clone the target
  const clone = cloneObject(target);
  // walk the property map array
  mappings.forEach((entry: IPropertyMap) => {
    // Verbose b/c typescript hates the use of property indexing
    // i.e. entry[sourceKey] make typescript angry
    const sourcePath = getProp(entry, sourceKey);
    const targetPath = getProp(entry, targetKey);
    // get the value from the source
    const sourceVal = getProp(source, sourcePath);
    // if it's not null or undefined
    if (sourceVal !== null && sourceVal !== undefined) {
      // set it
      deepSet(clone, targetPath, sourceVal);
    }
  });

  return clone;
}

/**
 *
 */
export class PropertyMapper<T> {
  public mappings: IPropertyMap[];
  constructor(mappings: IPropertyMap[]) {
    this.mappings = mappings;
  }
  modelToObject(model: IModel, object: T): T {
    return mapModelToObject(model, object, this.mappings);
  }

  objectToModel(object: T, model: IModel): IModel {
    return mapObjectToModel(object, model, this.mappings);
  }
}
