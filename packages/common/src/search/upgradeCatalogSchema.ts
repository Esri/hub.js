import { getProp } from "../objects";
import { cloneObject } from "../util";
import { IHubCatalog } from "./types";

const CATALOG_SCHEMA_VERSION = 1.0;

/**
 * Apply schema upgrades to Catalog objects
 * @param catalog
 * @returns
 */
export function upgradeCatalogSchema(catalog: any): IHubCatalog {
  let clone = cloneObject(catalog);
  if (getProp(clone, "schemaVersion") === CATALOG_SCHEMA_VERSION) {
    return clone;
  } else {
    // apply migrations in order
    clone = applyCatalogSchema(clone);

    return clone;
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

    // Handle legacy group structure
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

    // Handle legacy orgId value, which should only be present
    // for org-level home sites (e.g., "my-org.hub.arcgis.com")
    const orgId = getProp(original, "orgId");
    if (orgId) {
      catalog.scopes.item.filters.push({
        predicates: [
          // Portal uses `orgid` instead of `orgId`, so we comply.
          // While `orgid` is valid field for search, it does not count
          // towards Portal's requirement of needing at least one filter.
          { orgid: [orgId] },
        ],
      });
    }

    // 'Code Attachment' is an old AGO type that has
    // been defunct for some time, so add this predicate
    // to all catalog filter to omit 'Code Attachment' items
    // from search results
    catalog.scopes.item.filters.push({
      predicates: [{ type: { not: ["Code Attachment"] } }],
    });

    return catalog;
  }
}
