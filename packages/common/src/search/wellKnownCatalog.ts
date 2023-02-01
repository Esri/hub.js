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
  | "app"
  | "content"
  | "dataset"
  | "document"
  | "event"
  | "feedback"
  | "initiative"
  | "map"
  | "project"
  | "site"
  | "solution"
  | "template";

/**
 * @param {WellKnownCatalog} name name of the catalog requested
 * @param {EntityType} entityType entity type of the catalog
 * @param {IUser} user owner of the entity, optional but required for certain catalogs
 * @param {WellKnownCollection[]} collectionNames a list of collection names, optional, if passed in,
 * only those collections in the catalog will be returned
 */
export function getWellKnownCatalog(
  name: WellKnownCatalog,
  entityType: EntityType,
  user?: IUser,
  collectionNames?: WellKnownCollection[]
): IHubCatalog {
  switch (entityType) {
    case "item":
      return getWellknownItemCatalog(name, user, collectionNames);
    /* Add more entity handling here, e.g. getWellknownEventCatalog */
    default:
      throw new Error(`Wellknown catalog not implemented for "${entityType}".`);
  }
}

/**
 * @param {WellKnownCatalog} name name of the catalog requested
 * @param {IUser} user owner of the entity, optional but required for certain catalogs
 * @param {WellKnownCollection[]} collectionNames a list of collection names, optional, if passed in,
 * only those collections in the catalog will be returned
 */
function getWellknownItemCatalog(
  name: WellKnownCatalog,
  user?: IUser,
  collectionNames?: WellKnownCollection[]
): IHubCatalog {
  let catalog;
  switch (name) {
    case "myContent":
      if (user) {
        catalog = {
          schemaVersion: 1,
          title: "{{i18nScope}}.catalog.myContent",
          scopes: {
            item: {
              targetEntity: "item" as EntityType,
              filters: [{ predicates: [{ owner: user.username }] }],
            },
          },
          collections: getWellknownCollections("item", collectionNames),
        };
      } else {
        throw new Error(`User needed for getting "${name}" catalog`);
      }
      break;
    case "favorites":
      if (user) {
        catalog = {
          schemaVersion: 1,
          title: "{{i18nScope}}.catalog.favorites",
          scopes: {
            item: {
              targetEntity: "item" as EntityType,
              filters: [{ predicates: [{ group: user.favGroupId }] }],
            },
          },
          collections: getWellknownCollections("item", collectionNames),
        };
      } else {
        throw new Error(`User needed for getting "${name}" catalog`);
      }
      break;
    case "organization":
      catalog = {
        schemaVersion: 1,
        title: "{{i18nScope}}.catalog.organization",
        scopes: {
          item: {
            targetEntity: "item" as EntityType,
            filters: [{ predicates: [{ access: "org" }] }],
          },
        },
        collections: getWellknownCollections("item", collectionNames),
      };
      break;
    case "world":
      catalog = {
        schemaVersion: 1,
        title: "{{i18nScope}}.catalog.world",
        scopes: {
          item: {
            targetEntity: "item" as EntityType,
            filters: [{ predicates: [{ access: "public" }] }],
          },
        },
        collections: getWellknownCollections("item", collectionNames),
      };
      break;
  }
  return catalog;
}

/**
 * @param {EntityType} entityType entity type of the collections
 * @param {WellKnownCollection[]} names names of the list of collection requested, optional, if passed in,
 * only those collections will be returned
 */
export function getWellknownCollections(
  entityType: EntityType,
  names?: WellKnownCollection[]
): IHubCollection[] {
  const collections = [
    {
      key: "appsAndMaps",
      label: "{{i18nScope.collection.appsAndMaps}}",
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
    {
      key: "data",
      label: "{{i18nScope.collection.data}}",
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("dataset") }] }],
      },
    } as IHubCollection,
    {
      key: "document",
      label: "{{i18nScope.collection.document}}",
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("document") }] }],
      },
    } as IHubCollection,
    {
      key: "feedback",
      label: "{{i18nScope.collection.feedback}}",
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [{ predicates: [{ type: getFamilyTypes("feedback") }] }],
      },
    } as IHubCollection,
    {
      key: "sites",
      label: "{{i18nScope.collection.sites}}",
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
    {
      key: "templates",
      label: "{{i18nScope.collection.templates}}",
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
  ];
  if (names?.length) {
    return collections.reduce((accum, collection) => {
      names.forEach((name) => {
        if (name === collection.key) {
          accum.push(collection);
        }
      });
      return accum;
    }, [] as IHubCollection[]);
  } else {
    return collections;
  }
}
