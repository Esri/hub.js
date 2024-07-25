import { IArcGISContext } from "../ArcGISContext";
import { checkPermission } from "../permissions/checkPermission";
import { cloneObject } from "../util";
import { negateGroupPredicates } from "./_internal/negateGroupPredicates";
import { EntityType, IQuery } from "./types/IHubCatalog";
import { IUser } from "@esri/arcgis-rest-portal";
import { getPredicateValues } from "./getPredicateValues";
import { ContentTypeWorkflows } from "./types/TypeWorkflows";

/**
 * What content can be created, uploaded, or added to a Catalog.
 * Since a catalog is composed of collections, this returns an
 * array of `ICollectionContentConfig`s, which are composed of
 * `IQueryContentConfig`s
 * This stucture allows a catalog to have multiple collections,
 * each with varying targetEntities, groups, and types.
 * Collapsing this down into a single set of types and groups
 * does not ensure that the type the user creates/adds/uploads and
 * adds to a group, will actually result in it being included
 * in a collection in the catalog.
 */
export interface ICatalogContentConfig {
  /**
   * For each collection in the catalog, what can be created, uploaded, or added
   */
  collections: ICollectionContentConfig[];
}

/**
 * Configuration of  for a collection in a catalog
 */
export interface ICollectionContentConfig extends IQueryContentConfig {
  // Collection Title
  label: string;
  // Collection ID
  key: string;
  // collection target entity
  targetEntity: EntityType;
}

/**
 * Arrays of groupId's, based on the user's membership in the group
 */
export interface IGroupsByMembership {
  /**
   * Groups where the user is the owner, allowing them
   * to add / remove members, as well as share content
   * they do not own
   */
  owner: string[];
  /**
   * Groups where the user is an admin, allowing them
   * to add / remove members, as well as share content
   * they do not own
   */
  admin: string[];
  /**
   * Groups where the user is a member. ViewOnly groups
   * will not be included in this list.
   */
  member: string[];
}

/**
 * Configuration for what can be created, uploaded, or added
 * based on an IQuery. This is the lowest level of the config
 * and defines the three main workflows that a user can take
 * when interacting with content, defined by the query.
 */
export interface IQueryContentConfig {
  /**
   * What types can the user create, based on the query and the user's licensing
   * and permissions
   */
  create?: {
    types: string[]; // "Hub Project", "Event", "Group" etc
    groups: IGroupsByMembership;
  };
  /**
   * What types can the user upload, based on the query and the user's licensing
   * and permissions
   */
  upload?: {
    types: string[]; // "documents", "PDF", "Microsoft Excel" etc
    groups: IGroupsByMembership;
  };

  /**
   * What existing types can the user add, based on the query and the user's licensing
   * and permissions
   */
  existing?: {
    types: string[]; // "documents", "Web Map", "Layer Package" etc
    groups: IGroupsByMembership;
    /**
     * Query for content that the user owns.
     */
    mine: IQuery;
    /**
     * Query for content that the user's org owns
     * This can only be used if the user is an admin or owner
     * of the group they are sharing to
     */
    myOrg: IQuery;
    /**
     * Query for content that is shared to the world
     * This can only be used if the user is an admin or owner
     * of the group they are sharing to
     */
    world: IQuery;
  };
}

const DefaultContentConfigResponse: IQueryContentConfig = {
  create: {
    types: [],
    groups: {
      owner: [],
      member: [],
      admin: [],
    },
  },
  existing: {
    types: [],
    groups: {
      owner: [],
      member: [],
      admin: [],
    },
    mine: null,
    myOrg: null,
    world: null,
  },
  // At this point we are not handling "upload"
};

/**
 * Given an IQuery and an IArcGISContext, return an IQueryContentConfig
 * the defines the types the user can create, upload, or add, along with the groups
 * they must be shared to, to be included in the Query
 * @param query
 * @param context
 * @returns
 */
export function getQueryContentConfig(
  query: IQuery,
  context: IArcGISContext
): IQueryContentConfig {
  // construct the default response object
  let response = cloneObject(DefaultContentConfigResponse);

  // get the all the groups from all the predicates on all the filters in the query
  const userGroups = getUserGroupsFromQuery(query, context.currentUser);
  // if the user does not have any groups, we should return
  // an empty response
  if (
    !userGroups.owner.length &&
    !userGroups.admin.length &&
    !userGroups.member.length
  ) {
    return response;
  }

  // Handle targetEntity="item"
  if (query.targetEntity === "item") {
    response = handleItemQuery(query, userGroups, response, context);
  }

  if (query.targetEntity === "event") {
    response = handleEventQuery(query, userGroups, response, context);
  }

  // TODO: Add groups, people, and other targetEntities as needed

  return response;
}

/**
 * Specific logic for targetEntity="event"
 * @param query
 * @param userGroups
 * @param response
 * @param context
 * @returns
 */
function handleEventQuery(
  query: IQuery,
  userGroups: IGroupsByMembership,
  response: IQueryContentConfig,
  context: IArcGISContext
): IQueryContentConfig {
  // events can be created or added but the user needs permission
  if (checkPermission("hub:event:create", context).access) {
    response.create.types.push("Event");
    response.create.groups = userGroups;
  }
  // anyone can add an event (no permission check)
  response.existing.types.push("Event");
  response.existing.groups = userGroups;
  // we need to construct the mine, myOrg, and world queries for events
  const queries = constructExistingQueries(query, context);
  response.existing.mine = queries.mine;
  response.existing.myOrg = queries.myOrg;
  response.existing.world = queries.world;
  return response;
}

/**
 * Specific logic for targetEntity="item"
 * @param query
 * @param userGroups
 * @param response
 * @param context
 * @returns
 */
function handleItemQuery(
  query: IQuery,
  userGroups: IGroupsByMembership,
  response: IQueryContentConfig,
  context: IArcGISContext
): IQueryContentConfig {
  // Now get the types that can be created based on the query
  // get all the types, for all the filters, for all the predicates
  const queryTypes = getPredicateValues("type", query);

  // Now look up those types in the config and determine if they are creatable
  // and add into the two arrays on the response
  queryTypes.forEach((type: string) => {
    // now check if the user has the required permissions
    const typeWorkflowConfig = ContentTypeWorkflows.find(
      (ct) => ct.type === type
    );
    if (typeWorkflowConfig) {
      const chk = checkPermission(
        typeWorkflowConfig.permission,
        context
      ).access;
      if (chk) {
        if (typeWorkflowConfig.workflows.includes("create")) {
          response.create.types.push(type);
        }
        // Not handling "upload" at this point
        // if (configType.workflows.includes("upload")) {
        //   response.upload.types.push(type);
        // }

        // istanbul ignore else - all current config types have "existing"
        if (typeWorkflowConfig.workflows.includes("existing")) {
          response.existing.types.push(type);
        }
      }
    }
  });
  // Do we have any types in the .existing.types array?
  // if so, we need to add some queries query to the response
  if (response.existing.types.length) {
    const queries = constructExistingQueries(query, context);
    response.existing.mine = queries.mine;
    response.existing.myOrg = queries.myOrg;
    response.existing.world = queries.world;
    response.existing.groups = userGroups;
  }

  // now add the groups to the sections that have types
  if (response.create.types.length) {
    response.create.groups = userGroups;
  }
  // Not handling "upload" at this point
  // if (response.upload?.types.length) {
  //   response.upload.groups = userGroups;
  // }

  return response;
}

function constructExistingQueries(query: IQuery, context: IArcGISContext): any {
  const queries = {
    mine: null as IQuery,
    myOrg: null as IQuery,
    world: null as IQuery,
  };
  queries.world = negateGroupPredicates(query);
  // now clone it and add a predicate for the user's org
  queries.myOrg = cloneObject(queries.world);
  queries.myOrg.filters.push({
    predicates: [
      {
        orgid: context.currentUser.orgId,
      },
    ],
  });
  // now clone it and add a predicate for the user
  queries.mine = cloneObject(queries.world);
  queries.mine.filters.push({
    predicates: [
      {
        owner: context.currentUser.username,
      },
    ],
  });
  return queries;
}

/**
 * Given a query and a user, return an object with the set of groups
 * that are in the Query, and which the user is a member of, split by
 * membership type.
 * @param query
 * @param user
 * @returns
 */
function getUserGroupsFromQuery(
  query: IQuery,
  user: IUser
): IGroupsByMembership {
  const response: IGroupsByMembership = {
    owner: [],
    member: [],
    admin: [],
  };
  // collect up all the group predicates from the query's filters
  // NOTE: this only pulls the all and any predicates
  const groups: string[] = getPredicateValues("group", query);

  // get the user's groups
  const userGroups = user.groups || [];
  // loop through the groups and determine if the user is an admin or normal member
  // and add into the response
  groups.forEach((groupId) => {
    // get the group from the user's groups array
    const group = userGroups.find((g) => g.id === groupId);
    if (group) {
      if (group.userMembership?.memberType === "owner") {
        response.owner.push(groupId);
      }
      if (group.userMembership?.memberType === "admin") {
        response.admin.push(groupId);
      }
      // If user is just a member and the group is not view only
      if (group.userMembership?.memberType === "member" && !group.isViewOnly) {
        response.member.push(groupId);
      }
      // there is a `none` option in the userMembership but
      // that would never be returned in the user's groups
      // so we don't need to check for it
    }
  });
  return response;
}
