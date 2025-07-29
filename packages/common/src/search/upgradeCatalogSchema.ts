import { getProp } from "../objects";
import { cloneObject } from "../util";
import {
  EntityType,
  ICatalogScope,
  IHubCatalog,
  IPredicate,
  IQuery,
} from "./types";

// The current catalog schema version
export const CATALOG_SCHEMA_VERSION = 1.0;

const getAgoEntityOrgIdPredicates = (orgId: string): IPredicate[] => [
  // Portal uses `orgid` instead of `orgId`, so we comply.
  // While `orgid` is valid field for search, it does not count
  // towards Portal's requirement of needing at least one filter.
  { orgid: [orgId] },
  // Hack to force Portal to think that at least one filter has
  // been provided. 'Code Attachment' is an old AGO type that has
  // been defunct for some time, so the results won't be affected.
  { type: { not: ["Code Attachment"] } },
];

const getEventEntityOrgIdPredicates = (orgId: string): IPredicate[] => [
  { orgId },
];

const getGroupEntityOrgIdPredicates = (orgId: string): IPredicate[] => [
  { orgid: orgId },
];

const getUserEntityOrgIdPredicates = (orgId: string): IPredicate[] => [
  { orgid: orgId },
];

const ORG_ID_PREDICATE_FNS_BY_ENTITY_TYPE: Partial<
  Record<EntityType, (orgId: string) => IPredicate[]>
> = {
  item: getAgoEntityOrgIdPredicates,
  event: getEventEntityOrgIdPredicates,
  group: getGroupEntityOrgIdPredicates,
  user: getUserEntityOrgIdPredicates,
};

/**
 * Apply schema upgrades to Catalog objects
 * @param catalog
 * @returns
 */
export function upgradeCatalogSchema(catalog: any): IHubCatalog {
  if (getProp(catalog, "schemaVersion") === CATALOG_SCHEMA_VERSION) {
    return catalog;
  } else {
    let clone = cloneObject(catalog);

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
        event: {
          targetEntity: "event",
          filters: [],
        },
      },
      collections: [],
    };

    // Handle legacy group structure
    const rawGroups = getProp(original, "groups") || [];
    let groups: string[] = [];
    if (Array.isArray(rawGroups) && rawGroups.length) {
      groups = rawGroups;
    } else if (typeof rawGroups === "string") {
      groups = [rawGroups];
    }

    if (groups.length) {
      // add the group predicate to item & event scope queries
      catalog.scopes = Object.entries(catalog.scopes).reduce<ICatalogScope>(
        (acc, entry) => ({
          ...acc,
          [entry[0] as EntityType]: {
            ...entry[1],
            filters: [{ predicates: [{ group: groups }] }],
          },
        }),
        {}
      );
    }

    // Handle legacy orgId value, which should only be present
    // for org-level home sites (e.g., "my-org.hub.arcgis.com")
    const orgId = getProp(original, "orgId") as string;
    if (orgId) {
      // Org-level sites should ignore any configured groups.
      // They also need 'group' and 'user' scopes within the catalog.
      catalog.scopes.item = {
        targetEntity: "item",
        filters: [],
      };
      catalog.scopes.event = {
        targetEntity: "event",
        filters: [],
      };
      catalog.scopes.group = {
        targetEntity: "group",
        filters: [],
      };
      catalog.scopes.user = {
        targetEntity: "user",
        filters: [],
      };

      // add the org ID predicate to all the scope queries
      catalog.scopes = Object.entries(catalog.scopes).reduce<ICatalogScope>(
        (acc, entry) => {
          const entityType: EntityType = entry[0] as EntityType;
          const query: IQuery = entry[1];
          return {
            ...acc,
            [entityType]: {
              ...query,
              filters: [
                {
                  operation: "AND",
                  predicates:
                    ORG_ID_PREDICATE_FNS_BY_ENTITY_TYPE[entityType](orgId),
                },
              ],
            },
          };
        },
        {}
      );
    }

    return catalog;
  }
}
