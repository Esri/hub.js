import { IArcGISContext } from "../ArcGISContext";
import { checkPermission } from "../permissions/checkPermission";
import { cloneObject } from "../util";
import { negateGroupPredicates } from "./_internal/negateGroupPredicates";
import { IHubCatalog, IQuery } from "./types/IHubCatalog";
import { getPredicateValues } from "./getPredicateValues";
import {
  getDefaultCreateableTypes,
  getWorkflowForType,
} from "./_internal/getWorkflowForType";
import { getProp } from "../objects/get-prop";
import { getUserGroupsFromQuery } from "./_internal/getUserGroupsFromQuery";
import { getUserGroupsByMembership } from "./_internal/getUserGroupsByMembership";
import { IAddContentWorkflowConfig } from "./types/AddContentWorkflowTypes";
import { getCatalogGroups } from "./_internal";
import { IGroupsByMembership } from "./types/IGroupsByMembership";

const EmptyAddContentWorkflowConfig: IAddContentWorkflowConfig = {
  create: null,
  upload: null,
  existing: null,
  state: "disabled",
};

/**
 * Get the add content configuration, given nothing, or a catalog or query.
 * Delegates to the appropriate function based on the type of the input.
 * @param context
 * @param catalogOrQuery
 * @returns
 */
export function getAddContentConfig(
  context: IArcGISContext,
  catalogOrQuery?: IQuery | IHubCatalog
): IAddContentWorkflowConfig {
  if (catalogOrQuery) {
    if (getProp(catalogOrQuery, "targetEntity")) {
      return getAddContentConfigForQuery(catalogOrQuery as IQuery, context);
    } else if (getProp(catalogOrQuery, "schemaVersion")) {
      return getAddContentConfigForCatalog(
        catalogOrQuery as IHubCatalog,
        context
      );
    } else {
      // Some other type of object was passed in, so just return an empty config
      const result = cloneObject(EmptyAddContentWorkflowConfig);
      result.reason = "invalid-object";
      return result;
    }
  } else {
    // nothing was passed in, so return the default config
    return getDefaultAddContentConfig(context);
  }
}

/**
 * Return the default add content config for the user
 * This will just have "create" entries for the types the user can create
 * @param context
 * @returns
 */
function getDefaultAddContentConfig(
  context: IArcGISContext
): IAddContentWorkflowConfig {
  const response = cloneObject(EmptyAddContentWorkflowConfig);
  // get the types the user can create
  const types = getDefaultCreateableTypes(context);

  const workflowTypes = types.map((type) => {
    return getWorkflowForType(type, context);
  });

  workflowTypes.forEach((wft) => {
    // Looked at DRYing this up but typescript complained so I left it
    if (wft.workflows.includes("create")) {
      if (!response.create) {
        response.create = {
          targetEntity: wft.targetEntity,
          workflow: "create",
          types: [],
        };
      }
      response.create.types.push(wft.type);
    }
  });

  response.state = response.create?.types.length ? "enabled" : "disabled";

  if (response.state === "disabled") {
    response.reason = "no-permission";
  }

  return response;
}

/**
 * Given a catalog, collect all the groups in all the predicates
 * which the user is an owner, admin, or member of; and return
 * the default createable types for the user.
 * @param catalog
 * @param context
 * @returns
 */
function getAddContentConfigForCatalog(
  catalog: IHubCatalog,
  context: IArcGISContext
): IAddContentWorkflowConfig {
  let response = cloneObject(EmptyAddContentWorkflowConfig);
  const userGroups = getCatalogGroups(catalog, context);
  if (
    !userGroups.owner.length &&
    !userGroups.admin.length &&
    !userGroups.member.length
  ) {
    response.state = "disabled";
    response.reason = "not-in-groups";
    return response;
  }

  // We don't try to get the types from the catalog
  // we just use the default createable types
  response = getDefaultAddContentConfig(context);

  if (response.create) {
    response.create.groups = userGroups;
  } else {
    response.state = "disabled";
    response.reason = "no-permission";
  }

  return response;
}

/**
 * Get the config for a specific IQuery
 * Delegates based on targetEntity
 * @param query
 * @param context
 * @returns
 */
function getAddContentConfigForQuery(
  query: IQuery,
  context: IArcGISContext
): IAddContentWorkflowConfig {
  if (query.targetEntity === "item") {
    return getAddContentConfigForItemQuery(query, context);
  } else if (query.targetEntity === "event") {
    return getAddContentConfigForEventQuery(query, context);
  } else if (query.targetEntity === "group") {
    return getAddContentConfigForGroupQuery(query, context);
  } else {
    const response = cloneObject(EmptyAddContentWorkflowConfig);
    response.state = "disabled";
    response.reason = "unsupported-target-entity";
    return response;
  }
}

function getAddContentConfigForGroupQuery(
  _query: IQuery,
  context: IArcGISContext
): IAddContentWorkflowConfig {
  const response = cloneObject(EmptyAddContentWorkflowConfig);
  // groups can be created or added but the user needs permission
  const chk = checkPermission("hub:group:create", context);
  if (chk.access) {
    response.create = {
      targetEntity: "group",
      workflow: "create",
      types: ["Group"],
    };
    response.state = "enabled";
  } else {
    response.state = "disabled";
    response.reason = "no-permission";
    if (chk.response === "assertion-failed") {
      response.reason = "too-many-groups";
    }
  }

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
function getAddContentConfigForEventQuery(
  query: IQuery,
  context: IArcGISContext
): IAddContentWorkflowConfig {
  const response = cloneObject(EmptyAddContentWorkflowConfig);
  const userGroups = getUserGroupsFromQuery(query, context.currentUser);
  if (
    !userGroups.owner.length &&
    !userGroups.admin.length &&
    !userGroups.member.length
  ) {
    response.state = "disabled";
    response.reason = "not-in-groups";
    return response;
  }

  // events can be created or added but the user needs permission
  if (checkPermission("hub:event:create", context).access) {
    response.create = {
      targetEntity: "event",
      workflow: "create",
      types: ["Event"],
      groups: userGroups,
    };
  }
  // Anyone can add an event (no permission check)
  response.existing = {
    targetEntity: "event",
    workflow: "existing",
    types: ["Event"],
    query: negateGroupPredicates(query),
    groups: userGroups,
  };
  response.state = "enabled";
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
function getAddContentConfigForItemQuery(
  query: IQuery,
  context: IArcGISContext
): IAddContentWorkflowConfig {
  const response = cloneObject(EmptyAddContentWorkflowConfig);
  // We need to return groups by membership so we can show the group sharing ux
  let userGroups: IGroupsByMembership = {
    owner: [],
    admin: [],
    member: [],
  };

  // If the query has groups, then we need to check that the user is a member of those groups
  const groups: string[] = getPredicateValues("group", query);
  if (groups.length) {
    userGroups = getUserGroupsFromQuery(query, context.currentUser);
    if (
      !userGroups.owner.length &&
      !userGroups.admin.length &&
      !userGroups.member.length
    ) {
      response.state = "disabled";
      response.reason = "not-in-groups";
      return response;
    }
  } else {
    // we just need all the user's groups, as IGroupsByMembership object
    userGroups = getUserGroupsByMembership(context.currentUser);
  }

  // Get all the types from all the the predicates in all of the filters
  let queryTypes = getPredicateValues("type", query);

  // If there are no types we need to use the default creatable types
  if (!queryTypes.length) {
    queryTypes = getDefaultCreateableTypes(context, [query.targetEntity]);
  }

  const workflowTypes = queryTypes.map((type) => {
    return getWorkflowForType(type, context);
  });

  //
  const negatedGroupQuery = negateGroupPredicates(query);
  // now map over the workflowTypes and create the response object
  workflowTypes.forEach((wft) => {
    // Looked at DRYing this up but typescript complained so I left it
    if (wft.workflows.includes("create")) {
      if (!response.create) {
        response.create = {
          targetEntity: wft.targetEntity,
          workflow: "create",
          types: [],
          groups: userGroups,
        };
      }
      response.create.types.push(wft.type);
    }
    if (wft.workflows.includes("existing")) {
      if (!response.existing) {
        response.existing = {
          targetEntity: wft.targetEntity,
          workflow: "existing",
          types: [],
          groups: userGroups,
          query: negatedGroupQuery,
        };
      }
      response.existing.types.push(wft.type);
    }
  });

  // Did we get any workflows the user can do?
  if (response.create || response.existing) {
    response.state = "enabled";
  } else {
    response.state = "disabled";
    response.reason = "no-permission";
  }

  return response;
}
