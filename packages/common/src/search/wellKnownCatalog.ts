import { IUser } from "@esri/arcgis-rest-types";
import { getFamilyTypes } from "../content";
import { HubFamily } from "../types";
import { EntityType, IHubCatalog, IHubCollection } from "./types";

/**
 * This is used to determin what IHubCatalog definition JSON object
 * can be created
 */
export type WellKnownCatalog =
  | "myContent"
  | "myGroup"
  | "favorites"
  | "organization"
  | "world";

/**
 * This is used to determin what IHubCollection definition JSON object
 * can be created. We use HubFamily here to define most of the collections
 * to ensure consistency
 */
export type WellKnownCollection =
  | Exclude<HubFamily, "app" | "map">
  | "appAndMap"
  | "solution";

/**
 * A list of optional arguments to pass into getWellKnownCatalog
 */
interface IGetWellKnownCatalogOptions {
  user?: IUser;
  collectionNames?: WellKnownCollection[];
}

/**
 * Check if i18nScope is defined, if so add a "." at the end
 * @param i18nScope
 * @returns i18nScope with a "." at the end if it is defined so it stays
 * as a valid i18nScope
 * e.g. "project.edit.catalog" vs "project.editcatalog"
 */
function validateI18nScope(i18nScope: string): string {
  return i18nScope ? `${i18nScope}.` : "";
}

/** Get a single IHubCatalog definition JSON object based on the
 * name and entity type requested
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param name Name of the catalog requested
 * @param entityType
 * @param user Owner of the entity, optional but required for certain catalogs
 * @param collectionNames A list of collection names, optional, if passed in,
 * only those collections in the catalog will be returned
 */
export function getWellKnownCatalog(
  i18nScope: string,
  name: WellKnownCatalog,
  entityType: EntityType,
  options?: IGetWellKnownCatalogOptions
): IHubCatalog {
  switch (entityType) {
    case "item":
      return getWellknownItemCatalog(i18nScope, name, options);
    /* Add other entity handlers here, e.g. getWellknownEventCatalog */
    default:
      throw new Error(`Wellknown catalog not implemented for "${entityType}"`);
  }
}

/**
 * Build an IHubCatalog definition JSON object based on the
 * catalog name, predicate and collections we want to use for each catalog
 * @param i18nScope
 * @param name Catalog name
 * @param predicates Predicates for the catalog
 * @param collections Collections to include for the catalog
 * @returns An IHubCatalog definition JSON object
 */
function buildCatalog(
  i18nScope: string,
  name: WellKnownCatalog,
  predicates: any[],
  collections: IHubCollection[]
): IHubCatalog {
  return {
    schemaVersion: 1,
    title: `{{${i18nScope}catalog.${name}:translate}}`,
    scopes: {
      item: {
        targetEntity: "item" as EntityType,
        filters: [{ predicates }],
      },
    },
    collections,
  };
}

/**
 * Validate the arguments based on its type
 * @param type type of arg to validate
 * @param name name of the catalog
 * @param args arguments to validate
 */
function validateArgs(type: string, name: WellKnownCatalog, args: any): any {
  switch (type) {
    case "user":
      if (!args?.user) {
        throw new Error(`User needed to get "${name}" catalog`);
      }
  }
}

/**
 * Get an ITEM IHubCatalog definitely JSON object
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param name Name of the catalog requested
 * @param user Owner of the entity, optional but required for certain catalogs
 * @param collectionNames A list of collection names, optional, if passed in,
 * only those collections in the catalog will be returned
 * @returns An ITEM IHubCatalog definition JSON object
 */
function getWellknownItemCatalog(
  i18nScope: string,
  name: WellKnownCatalog,
  options?: IGetWellKnownCatalogOptions
): IHubCatalog {
  i18nScope = validateI18nScope(i18nScope);

  let catalog;
  const collections = getWellknownCollections(
    i18nScope,
    "item",
    options?.collectionNames
  );
  switch (name) {
    case "myContent":
      validateArgs("user", name, options?.user);
      catalog = buildCatalog(
        i18nScope,
        name,
        [{ owner: options?.user.username }],
        collections
      );
      break;
    case "favorites":
      validateArgs("user", name, options?.user);
      catalog = buildCatalog(
        i18nScope,
        name,
        [{ group: options?.user.favGroupId }],
        collections
      );
      break;
    case "organization":
      validateArgs("user", name, options?.user);
      catalog = buildCatalog(
        i18nScope,
        name,
        [{ orgid: options?.user.orgId, access: "org" }],
        collections
      );
      break;
    case "world":
      catalog = buildCatalog(
        i18nScope,
        name,
        [{ access: "public" }],
        collections
      );
      break;
  }
  return catalog;
}

/**
 * Get a complete collections map to use to build a collections list
 * @param i18nScope
 * @param entityType
 * @returns an object that contains properties of all the collections
 */
function getAllCollectionsMap(i18nScope: string, entityType: EntityType): any {
  return {
    appAndMap: {
      key: "appAndMap",
      label: `{{${i18nScope}collection.appsAndMaps:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            predicates: [
              {
                type: [...getFamilyTypes("app"), ...getFamilyTypes("map")],
              },
            ],
          },
        ],
      },
    } as IHubCollection,
    dataset: {
      key: "dataset",
      label: `{{${i18nScope}collection.dataset:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("dataset") }] }],
      },
    } as IHubCollection,
    document: {
      key: "document",
      label: `{{${i18nScope}collection.document:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("document") }] }],
      },
    } as IHubCollection,
    feedback: {
      key: "feedback",
      label: `{{${i18nScope}collection.feedback:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("feedback") }] }],
      },
    } as IHubCollection,
    site: {
      key: "site",
      label: `{{${i18nScope}collection.sites:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            predicates: [
              {
                type: getFamilyTypes("site"),
              },
            ],
          },
        ],
      },
    } as IHubCollection,
    template: {
      key: "template",
      label: `{{${i18nScope}collection.templates:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            predicates: [
              {
                type: getFamilyTypes("template"),
              },
            ],
          },
        ],
      },
    } as IHubCollection,
  };
}

/**
 * Get a list of collection names we want to use to build the default collections if no specific collection names are passed
 * @returns a list of WellKnownCollection definition strings
 */
function getDefaultCollectionNames(): WellKnownCollection[] {
  return ["appAndMap", "dataset", "document", "feedback", "site"];
}

/**
 * Get a list of IHubCollection definition JSON objects based on the
 * entity type and an optional collection names, will return a list of
 * default collections if not passed
 * @param i18nScope Translation scope to be interpolated into the collections
 * @param entityType
 * @param names List of names of the requested collections, optional, if passed in,
 * only those collections will be returned
 * @returns A list of IHubCollection definition JSON objects
 */
export function getWellknownCollections(
  i18nScope: string,
  entityType: EntityType,
  collectionNames?: WellKnownCollection[]
): IHubCollection[] {
  i18nScope = validateI18nScope(i18nScope);

  const allCollectionsMap = getAllCollectionsMap(i18nScope, entityType);

  const defaultCollectionNames = getDefaultCollectionNames();

  // Return a list of collections from the passed collection names or
  // return the default ones if not passed
  const names = collectionNames?.length
    ? collectionNames
    : defaultCollectionNames;
  return names.reduce((accum, name) => {
    if (allCollectionsMap[name]) {
      accum.push(allCollectionsMap[name]);
    }
    return accum;
  }, []);
}
