import { CANNOT_DISCUSS } from "../../discussions";
import { isDiscussable } from "../../discussions/utils";
import { deepSet, getProp, setProp } from "../../objects";
import { cloneObject } from "../../util";

/**
 * @private
 * Manage forward and backward property mappings to
 * streamline conversion between the Hub Entities, and
 * the backing Store objects.
 */
export class PropertyMapper<E, S> {
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
   * Map properties from a Store object, on to an Entity object.
   *
   * Used when constructing an Entity from a fetched Store object,
   * in which case the Entity should be an empty object (`{}`).
   *
   * Can also be used to apply changes to an Entity from a Store,
   * in which case an existing Entity can be passed in.
   * @param store
   * @param entity
   * @returns
   */
  storeToEntity(store: S, entity: E): E {
    const obj = mapStoreToEntity(store, entity, this.mappings);
    // Additional Read-Only Model Level Property Mappings

    // ------------------------------
    // canEdit and canDelete
    // ------------------------------
    // use setProp to side-step typechecking
    if (getProp(store, "item")) {
      const itm = getProp(store, "item");
      setProp("canEdit", ["admin", "update"].includes(itm.itemControl), obj);
      setProp("canDelete", itm.itemControl === "admin", obj);
    }

    return obj;
  }

  /**
   * Map properties from an entity object onto a model.
   *
   * Typically the model will already exist, and this
   * method is used to transfer changes to the model
   * prior to storage.
   * @param entity
   * @param store
   * @returns
   */
  entityToStore(entity: E, store: S): S {
    return mapEntityToStore(entity, store, this.mappings);
  }
}

/**
 * Property Map Entry that provides a cross-walk
 * between a property path (`name`) on the entity
 * to a property path on a store (`item.title`).
 *
 * This enables autmatic mapping of properties between
 * the two types of objects.
 */
export interface IPropertyMap {
  entityKey: string;
  storeKey: string;
}

/**
 * Generic function to apply properties from an Object
 * (i.e. IHubProject) onto a Model that can be persisted to an Item
 * @param entity
 * @param store
 * @param mappings
 * @returns
 */
export function mapEntityToStore<E, S>(
  entity: E,
  store: S,
  mappings: IPropertyMap[]
): S {
  if (getProp(store, "item")) {
    const item = getProp(store, "item");
    if (item.typeKeywords) {
      item.typeKeywords = getProp(entity, "isDiscussable")
        ? item.typeKeywords.filter(
            (typeKeyword: string) => typeKeyword !== CANNOT_DISCUSS
          )
        : [...item.typeKeywords, CANNOT_DISCUSS];
      setProp("item.typeKeywords", item.typeKeywords, store);
    }
  }

  return mapProps(entity, "entityKey", store, "storeKey", mappings);
}

/**
 * Generic function to apply properties from a Model
 * onto an Object (i.e. IHubProject etc)
 * @param store
 * @param entity
 * @param mappings
 * @returns
 */
export function mapStoreToEntity<S, E>(
  store: S,
  entity: E,
  mappings: IPropertyMap[]
): E {
  // Item specific logic...
  if (getProp(store, "item")) {
    const item = getProp(store, "item");
    setProp("isDiscussable", isDiscussable(item), entity);
  }

  return mapProps(store, "storeKey", entity, "entityKey", mappings);
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
    // i.e. entry<T>[sourceKey] makes typescript angry
    const sourcePath = getProp(entry, sourceKey);
    const targetPath = getProp(entry, targetKey);
    // get the value from the source
    const sourceVal = getProp(source, sourcePath);
    // if it's not null or undefined
    if (sourceVal !== null && sourceVal !== undefined) {
      // set it
      deepSet(clone, targetPath, sourceVal, true);
    }
  });

  return clone;
}
