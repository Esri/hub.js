import type { IUser } from "@esri/arcgis-rest-portal";
import { getFamilyTypes } from "../content/get-family";
import { HubFamily } from "../hub-types";
import { EntityType, IFilter, IHubCatalog, IHubCollection } from "./types";
import { buildCatalog } from "./_internal/buildCatalog";
import { getProp } from "../objects";
import type { IArcGISContext } from "../types/IArcGISContext";

/**
 * This is used to determine what IHubCatalog definition JSON object
 * can be created
 */
export type WellKnownCatalog =
  | "myContent"
  | "favorites"
  | "organization"
  | "world"
  | "editGroups"
  | "viewGroups"
  | "allGroups"
  | "partners"
  | "community"
  | "livingAtlas";

/**
 * This is used to determine what IHubCollection definition JSON object
 * can be created. We use HubFamily here to define most of the collections
 * to ensure consistency
 */
export type WellKnownCollection =
  | Exclude<HubFamily, "app" | "map">
  | "appAndMap"
  | "solution"
  | "projectAndInitiative";

/**TODO: On the next breaking change User and context should be
 * removed from this interface and passed into the function as a single required context.
 */
/**
 * A list of optional arguments to pass into getWellKnownCatalog
 * user is the owner of the entity
 * collectionNames is a list of names of the collections, only those collections
 * in the catalog will be returned
 */
export interface IGetWellKnownCatalogOptions {
  user?: IUser;
  collectionNames?: WellKnownCollection[];
  /** additional filters to apply to the catalog scope */
  filters?: IFilter[];
  /** optional context */
  context?: IArcGISContext;
}

/**
 * Check if i18nScope is defined and not ending with a ".", if so add a "." at the end.
 * e.g. if the i18nScope is 'project.edit', the path is `${i18nScope}catalog.organization`,
 * we will want "project.edit.catalog.organization" instead of "project.editcatalog.organization"
 * @param i18nScope
 * @returns i18nScope with a "." at the end if it is defined
 */
export function dotifyString(i18nScope: string): string {
  return i18nScope && i18nScope.slice(-1) !== "." ? `${i18nScope}.` : i18nScope;
}

/** Get a single catalog based on the catalog name, entity type and optional requests
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param name Name of the catalog requested
 * @param entityType
 * @param options An opitional IGetWellKnownCatalogOptions definition JSON object
 * @returns An IHubCatalog definition JSON object
 */
export function getWellKnownCatalog(
  i18nScope: string,
  catalogName: WellKnownCatalog,
  entityType: EntityType,
  options?: IGetWellKnownCatalogOptions
): IHubCatalog {
  switch (entityType) {
    case "item":
      return getWellknownItemCatalog(i18nScope, catalogName, options);
    case "group":
      return getWellknownGroupCatalog(i18nScope, catalogName, options);
    /* Add other entity handlers here, e.g. getWellknownEventCatalog */
    default:
      throw new Error(`Wellknown catalog not implemented for "${entityType}"`);
  }
}

/**
 * Check if user is available in the passed options, throw an error if not
 * @param catalogName
 * @param options Options that contains user
 */
function validateUserExistence(
  catalogName: WellKnownCatalog,
  options: IGetWellKnownCatalogOptions
) {
  if (!options || !options.user) {
    throw new Error(`User needed to get "${catalogName}" catalog`);
  }
}

/** TODO: On the next breaking change we need to pull context and user out of options
 * and make context a required parameter. User can be pulled out of context.
 */
/**
 * Get an ITEM catalog based on the name and optional requests
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param catalogName Name of the catalog requested
 * @param options An opitional IGetWellKnownCatalogOptions definition JSON object
 * @returns An ITEM IHubCatalog definition JSON object
 */
function getWellknownItemCatalog(
  i18nScope: string,
  catalogName: WellKnownCatalog,
  options?: IGetWellKnownCatalogOptions
): IHubCatalog {
  i18nScope = dotifyString(i18nScope);
  let catalog;
  const additionalFilters = getProp(options, "filters") || [];
  const context = getProp(options, "context");
  const collections = getWellknownCollections(
    i18nScope,
    "item",
    options?.collectionNames
  );
  switch (catalogName) {
    case "myContent":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [
          { predicates: [{ owner: options.user.username }] },
          ...additionalFilters,
        ],
        collections,
        "item"
      );
      break;
    case "favorites":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [
          { predicates: [{ group: options.user.favGroupId }] },
          ...additionalFilters,
        ],
        collections,
        "item"
      );
      break;
    case "organization":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [{ predicates: [{ orgid: options.user.orgId }] }, ...additionalFilters],
        collections,
        "item"
      );
      break;
    case "partners":
      // Get trusted orgs that aren't the current user's org or the community org
      const trustedOrgIds = context.trustedOrgIds.filter((orgId: string) => {
        return (
          orgId !== context.currentUser.orgId &&
          orgId !== _getCOrgOrEOrgId(context)
        );
      });
      // only build the catalog if there are trusted orgs
      if (trustedOrgIds.length) {
        catalog = buildCatalog(
          i18nScope,
          catalogName,
          [
            {
              predicates: [
                {
                  orgid: trustedOrgIds,
                  searchUserAccess: "includeTrustedOrgs",
                },
              ],
            },
            ...additionalFilters,
          ],
          collections,
          "item"
        );
      }
      break;
    case "community":
      const communityOrgId = _getCOrgOrEOrgId(context);
      // only build the catalog if there is a community org id
      if (communityOrgId) {
        catalog = buildCatalog(
          i18nScope,
          catalogName,
          [{ predicates: [{ orgid: communityOrgId }] }, ...additionalFilters],
          collections,
          "item",
          // If we're in a community org, use the community org name
          // as the catalog title
          context.isCommunityOrg
            ? _getEOrgName(communityOrgId, context)
            : undefined
        );
      }
      break;
    case "livingAtlas":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [{ predicates: [{ owner: "Esri_LivingAtlas" }] }],
        collections,
        "item"
      );
      break;
    case "world":
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [
          { predicates: [{ type: { not: ["code attachment"] } }] },
          ...additionalFilters,
        ],
        collections,
        "item"
      );
      break;
  }
  return catalog;
}

/**
 * Get the c-org or e-org ID. Defaults to the communityOrgId if the user is currently authed into
 * an e-org; otherwise it looks up the trusted org relationship to get the e-org id
 * @param context IArcGISContext
 * @returns orgid of the c-org or e-org
 */
function _getCOrgOrEOrgId(context: IArcGISContext): string {
  // extract the c-org / e-org relationship
  const cOrgEOrgTrustedRelationship = context.trustedOrgs.find(
    (org: any) => org.from.orgId === context.currentUser.orgId
  );

  // if we're in a community org, and there is a trusted org
  // relationship, use the orgId from there (which would be
  // the e-org id). Otherwise, use the c-org id
  return context.isCommunityOrg && cOrgEOrgTrustedRelationship
    ? cOrgEOrgTrustedRelationship.to.orgId
    : context.communityOrgId;
}

/**
 * If the user is in a community org, get the e-org name from the trusted org relationship
 * @param eOrgId E-org id
 * @param context IArcGISContext
 * @returns E-org name
 */
function _getEOrgName(eOrgId: string, context: IArcGISContext): string {
  // extract the c-org / e-org relationship
  const communityTrustedOrgRelationship = context.trustedOrgs.find(
    (org: any) => org.to.orgId === eOrgId
  );

  return communityTrustedOrgRelationship.to.name;
}

/**
 * Get a group catalog based on the name and optional requests
 * @param i18nScope Translation scope to be interpolated into the catalog
 * @param catalogName Name of the catalog requested
 * @param options An opitional IGetWellKnownCatalogOptions definition JSON object
 * @returns A group IHubCatalog definition JSON object
 */
function getWellknownGroupCatalog(
  i18nScope: string,
  catalogName: WellKnownCatalog,
  options?: IGetWellKnownCatalogOptions
): IHubCatalog {
  i18nScope = dotifyString(i18nScope);
  let catalog;
  const additionalFilters = getProp(options, "filters") || [];
  // because collections are needed in arcgis-hub-catalog and
  // "searchGroups" allows 'q: "*"', we use this as the collection
  const collections = [
    {
      targetEntity: "group" as EntityType,
      key: catalogName,
      label: catalogName,
      scope: {
        targetEntity: "group" as EntityType,
        filters: [
          {
            predicates: [{ q: "*" }],
          },
        ],
      },
    },
  ];

  switch (catalogName) {
    case "editGroups":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [
          { predicates: [{ capabilities: ["updateitemcontrol"] }] },
          ...additionalFilters,
        ],
        collections,
        "group"
      );
      break;
    case "viewGroups":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [
          { predicates: [{ capabilities: { not: ["updateitemcontrol"] } }] },
          ...additionalFilters,
        ],
        collections,
        "group"
      );
      break;
    case "allGroups":
      validateUserExistence(catalogName, options);
      catalog = buildCatalog(
        i18nScope,
        catalogName,
        [{ predicates: [{ capabilities: [""] }] }, ...additionalFilters],
        collections,
        "group"
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
      label: `{{${i18nScope}collection.documents:translate}}`,
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
    project: {
      key: "project",
      label: `{{${i18nScope}collection.projects:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            predicates: [
              {
                type: getFamilyTypes("project"),
              },
            ],
          },
        ],
      },
    } as IHubCollection,
    // note: For now, this is not included in the default collection names.
    // It would need to be explicitly passed into getWellknownCollections
    // to be returned
    initiative: {
      key: "initiative",
      label: `{{${i18nScope}collection.initiatives:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            predicates: [
              {
                type: getFamilyTypes("initiative"),
                // only include v2 initiatives
                typekeywords: ["hubInitiativeV2"],
              },
            ],
          },
        ],
      },
    } as IHubCollection,
    // note: For now, this is not included in the default collection names.
    // It would need to be explicitly passed into getWellknownCollections
    // to be returned
    projectAndInitiative: {
      key: "projectAndInitiative",
      label: `{{${i18nScope}collection.projectsAndInitiatives:translate}}`,
      targetEntity: entityType,
      include: [],
      scope: {
        targetEntity: entityType,
        filters: [
          {
            operation: "OR",
            predicates: [
              {
                type: getFamilyTypes("project"),
              },
              {
                type: getFamilyTypes("initiative"),
                // only include v2 initiatives
                typekeywords: ["hubInitiativeV2"],
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
  return ["appAndMap", "dataset", "document", "feedback", "site", "project"];
}

/**
 * Get a list of collections based on the entity type and an optional
 * list of collection names, will return a list of default collections if none passed
 * @param i18nScope Translation scope to be interpolated into the collections
 * @param entityType
 * @param collectionNames List of names of the requested collections, optional, if passed in,
 * only those collections will be returned
 * @returns A list of IHubCollection definition JSON objects
 */
export function getWellknownCollections(
  i18nScope: string,
  entityType: EntityType,
  collectionNames?: WellKnownCollection[]
): IHubCollection[] {
  i18nScope = dotifyString(i18nScope);

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

/**
 * Get a single collection based on the collection name and entity type
 * @param i18nScope
 * @param entityType
 * @param collectionName Name of the collection requested
 * @returns An IHubCollection definition JSON object
 */
export function getWellknownCollection(
  i18nScope: string,
  entityType: EntityType,
  collectionName: WellKnownCollection
): IHubCollection {
  i18nScope = dotifyString(i18nScope);
  return getAllCollectionsMap(i18nScope, entityType)[collectionName];
}
