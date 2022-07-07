import { getProp } from "../objects";
import { IHubCatalog } from "./types";

const CATALOG_SCHEMA_VERSION = 1.0;

/**
 * Apply schema upgrades to Catalog objects
 * @param catalog
 * @returns
 */
export function upgradeCatalogSchema(catalog: any): IHubCatalog {
  if (getProp(catalog, "schemaVersion") === CATALOG_SCHEMA_VERSION) {
    return catalog;
  } else {
    // apply migrations in order
    catalog = applyCatalogSchema(catalog);

    return catalog;
  }
}

/**
 * Apply the Catalog schema to the original, unversioned
 * site catalog objects
 * @param original
 * @returns
 */
function applyCatalogSchema(original: any): IHubCatalog {
  if (getProp(original, "schemaVersion") > 1.0) {
    return original as IHubCatalog;
  } else {
    const catalog: IHubCatalog = {
      schemaVersion: 1,
      title: "Default Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [],
        },
      },
      collections: [],
    };

    const rawGroups = getProp(original, "groups");
    let groups = [];
    if (Array.isArray(rawGroups) && rawGroups.length) {
      groups = rawGroups;
    } else if (typeof rawGroups === "string") {
      groups = [rawGroups];
    }

    if (groups.length) {
      catalog.scopes.item.filters.push({
        predicates: [{ group: groups }],
      });
    }

    return catalog;
  }
}

/**
 * DEPRECATED: Use upgradeCatalogSchema(...)
 * @param original
 */
export function convertCatalog(original: any): IHubCatalog {
  return upgradeCatalogSchema(original);
}
