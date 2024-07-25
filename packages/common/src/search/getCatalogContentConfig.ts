import { IArcGISContext } from "../ArcGISContext";
import { Catalog } from "./Catalog";
import {
  ICatalogContentConfig,
  ICollectionContentConfig,
  getQueryContentConfig,
} from "./getQueryContentConfig";
import { IHubCatalog, IQuery } from "./types/IHubCatalog";

/**
 * Return an object that contains the content configuration for a catalog,
 * on a per-collection basis.
 * If the catalog has scopes without collections, synthetic collections
 * are created, one for each scope.
 * @param catalog
 * @param context
 * @returns
 */
export function getCatalogContentConfig(
  catalog: IHubCatalog,
  context: IArcGISContext
): ICatalogContentConfig {
  // create the catalog
  const instance = Catalog.fromJson(catalog, context);
  // get the collections
  const collections = instance.collectionNames.map((name) => {
    // important that we use .getCollection as that merges in the
    // scope from the catalog
    const collection = instance.getCollection(name);
    // cerate the config for the collection
    const entry: ICollectionContentConfig = {
      label: collection.label,
      key: collection.key,
      targetEntity: collection.targetEntity,
      ...getQueryContentConfig(collection.scope, context),
    };
    return entry;
  });

  // get the scopes that do not have related collections
  const nakedScopeEntityTypes = Object.keys(catalog.scopes).reduce(
    (acc, key) => {
      // check if there are colletions with this targetEntity
      const hasCollection = collections.some(
        (collection) => collection.targetEntity === key
      );
      // if not, add it to the list
      if (!hasCollection) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  nakedScopeEntityTypes.forEach((targetEntity) => {
    // get the scope
    const scopeQuery = instance.getScope(targetEntity) as IQuery;
    // create the config for the scope
    const entry: ICollectionContentConfig = {
      label: `Synthetic ${targetEntity}`,
      key: `synthetic-${targetEntity}`,
      targetEntity: scopeQuery.targetEntity,
      ...getQueryContentConfig(scopeQuery, context),
    };
    collections.push(entry);
  });

  return {
    collections,
  };
}
