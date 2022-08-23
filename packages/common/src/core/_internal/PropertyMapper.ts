import { cloneObject, deepSet, getProp, IModel } from "../..";

/**
 * @private
 * Manage forward and backward property mappings to
 * streamline conversion between the Hub entities, and
 * the backing IModel
 */
export class PropertyMapper<T> {
  public mappings: IPropertyMap[];
  /**
   * Pass in the mappings between the Entity and
   * it's backing structure (model or otherwise)
   * @param mappings
   */
  constructor(mappings: IPropertyMap[]) {
    this.mappings = mappings;
  }
  /**
   * Map properties from a model on to the entity object.
   *
   * Used when constructing an entity can from a fetched model,
   * in which case the entity should be an empty object (`{}`).
   *
   * Can also be used to apply changes to an entity from a model,
   * in which case an existing entity can be passed in.
   * @param model
   * @param object
   * @returns
   */
  modelToObject(model: IModel, object: T): T {
    return mapModelToObject(model, object, this.mappings);
  }

  /**
   * Map properties from an entity object onto a model.
   *
   * Typically the model will already exist, and this
   * method is used to transfer changes to the model
   * prior to storage.
   * @param object
   * @param model
   * @returns
   */
  objectToModel(object: T, model: IModel): IModel {
    return mapObjectToModel(object, model, this.mappings);
  }
}

/**
 * Property Map Entry that provides a cross-walk
 * between a property path (`name`) on the "object"
 * to a property path on a model (`item.title`).
 *
 * This enables autmatic mapping of properties between
 * the two types of objects.
 */
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
    // Verbose b/c typescript hates the use of property indexing with generics
    // i.e. entry<T>[sourceKey] make typescript angry
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
