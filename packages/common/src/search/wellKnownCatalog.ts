import { IUser } from "@esri/arcgis-rest-types";
import { getFamilyTypes } from "../content";
import { EntityType, IHubCatalog, IHubCollection } from "./types";

export type WellKnownCatalog =
  | "myContent"
  | "myGroup"
  | "favorites"
  | "organization"
  | "world";

export type WellKnownCollection =
  | "appAndMap"
  | "content"
  | "dataset"
  | "document"
  | "event"
  | "feedback"
  | "initiative"
  | "project"
  | "site"
  | "solution"
  | "template";

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

function getDefaultCollectionNames(): string[] {
  return ["appAndMap", "dataset", "document", "feedback", "site"];
}

/**
 * Check if i18nScope is defined, if so add a `.` at the end
 */
function validateI18nScope(i18nScope: string): string {
  return i18nScope ? `${i18nScope}.` : `${i18nScope}`;
}

/** This function returns a single IHubCatalog definition JSON object based on the
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
  user?: IUser,
  collectionNames?: WellKnownCollection[]
): IHubCatalog {
  switch (entityType) {
    case "item":
      return getWellknownItemCatalog(i18nScope, name, user, collectionNames);
    /* Add other entity handlers here, e.g. getWellknownEventCatalog */
    default:
      throw new Error(`Wellknown catalog not implemented for "${entityType}"`);
  }
}

/**
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param name Name of the catalog requested
 * @param user Owner of the entity, optional but required for certain catalogs
 * @param collectionNames A list of collection names, optional, if passed in,
 * only those collections in the catalog will be returned
 * @returns An Item IHubCatalog definition JSON object
 */
function getWellknownItemCatalog(
  i18nScope: string,
  name: WellKnownCatalog,
  user?: IUser,
  collectionNames?: WellKnownCollection[]
): IHubCatalog {
  i18nScope = validateI18nScope(i18nScope);

  let catalog;
  const collections = getWellknownCollections(
    i18nScope,
    "item",
    collectionNames
  );
  switch (name) {
    case "myContent":
      if (user) {
        catalog = {
          schemaVersion: 1,
          title: `{{${i18nScope}catalog.myContent:translate}}`,
          scopes: {
            item: {
              targetEntity: "item" as EntityType,
              filters: [{ predicates: [{ owner: user.username }] }],
            },
          },
          collections,
        };
      } else {
        throw new Error(`User needed to get "${name}" catalog`);
      }
      break;
    case "favorites":
      if (user) {
        catalog = {
          schemaVersion: 1,
          title: `{{${i18nScope}catalog.favorites:translate}}`,
          scopes: {
            item: {
              targetEntity: "item" as EntityType,
              filters: [{ predicates: [{ group: user.favGroupId }] }],
            },
          },
          collections,
        };
      } else {
        throw new Error(`User needed to get "${name}" catalog`);
      }
      break;
    case "organization":
      catalog = {
        schemaVersion: 1,
        title: `{{${i18nScope}catalog.organization:translate}}`,
        scopes: {
          item: {
            targetEntity: "item" as EntityType,
            filters: [{ predicates: [{ access: "org" }] }],
          },
        },
        collections,
      };
      break;
    case "world":
      catalog = {
        schemaVersion: 1,
        title: `{{${i18nScope}catalog.world:translate}}`,
        scopes: {
          item: {
            targetEntity: "item" as EntityType,
            filters: [{ predicates: [{ access: "public" }] }],
          },
        },
        collections,
      };
      break;
  }
  return catalog;
}

/**
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
