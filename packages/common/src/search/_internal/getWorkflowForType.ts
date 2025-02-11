import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../../permissions/checkPermission";
import { Permission } from "../../permissions/types/Permission";
import { EntityType } from "../types/IHubCatalog";

/**
 * DEPRECATED: moved to hub-components
 * @internal
 * Define the workflows that are available for each content type
 */
export interface ITypeWorkflow {
  /**
   * The "type" the workflow applies to. This is not strictly an Item Type,
   * it can also be an abstraction like "document", as well as things like Group
   * or Event which are not item-backed.
   */
  type: string;

  /**
   * The target entity type for the type
   */
  targetEntity: EntityType;
  /**
   * The workflows that are available for the type
   */
  workflows: ContentWorkflow[];
  /**
   * Additional properties that may apply to some workflows
   * e.g. upload file types for the type
   */
  properties?: Record<string, any>;
}

/**
 * DEPRECATED: moved to hub-components
 * @internal
 * Structure that defines the permission checks and workflows for each content type
 */
export interface ITypeWorkflowDefinition extends ITypeWorkflow {
  /**
   * The permission required to create content of this type
   */
  permission: Permission;
}

/**
 * DEPRECATED: moved to hub-components
 * @internal
 * Define the workflows
 */
export type ContentWorkflow = "create" | "upload" | "existing";

/**
 * DEPRECATED: moved to hub-components
 * Given a type and context, return the workflows that are available to the user.
 * This checks the permissions for defined for the type, and if the user has the
 * permission, returns the workflows defined for the type.
 * @param type
 * @param context
 * @returns
 */
export function getWorkflowForType(
  type: string,
  context: IArcGISContext
): ITypeWorkflow {
  // Default response is an empty array of workflows
  // meaning the user can not do anything with this type
  const response = {
    type,
    targetEntity: "item" as EntityType,
    workflows: [] as ContentWorkflow[],
  };

  // If the type has a definition, we use those settings, but otherwise
  // we default to "existing"
  const definition = TypeWorkflowDefinitions.find((ct) => ct.type === type);
  // if we don't have a definition, we default to "existing"
  if (!definition) {
    // check of the user can share items
    if (checkPermission("platform:portal:user:shareToGroup", context).access) {
      response.workflows = ["existing"];
    } else {
      // if the user can't share items, we don't return any workflows
      // FUTURE: Add the failed permisson check to the response
    }
  } else {
    // ensure the targetEntity is set
    response.targetEntity = definition.targetEntity;
    // otherwise we check the permission first...
    if (checkPermission(definition.permission, context).access) {
      response.workflows = definition.workflows;
    } else {
      // we leave the workflows empty if the user does not have the permission
      // FUTURE: Add the failed permisson check to the response
    }
  }
  return response;
}

/**
 * DEPRECATED: moved to hub-components
 * Return a list of types to use as the "default" types a user could possibly
 * create / add (depending on permissions and group access).
 * This list is used when an IQuery does not have type predicates, which
 * we interpret as "all types", which is this list.
 * @param context
 * @returns
 */
export function getDefaultCreateableTypes(
  context: IArcGISContext,
  limitTo: EntityType[] = []
): string[] {
  // NOTE: AT prescribed the order: Discussion Board, Event, Project, Initiative, Group, Site Page | Hub Page, Site Application | Hub Site Application
  const prescribedOrder = [
    "Discussion",
    "Event",
    "Hub Project",
    "Hub Initiative",
    "Group",
    "Hub Page",
    "Site Page",
    "Hub Site Application",
    "Site Application",
  ];
  const itemCreateableTypes = ["Discussion", "Hub Project", "Hub Initiative"];
  // If the user has the hub:license:enterprise-sites permission
  // they are on Enterprise and the types are "site applications" and "site pages"
  if (checkPermission("hub:environment:enterprise", context).access) {
    itemCreateableTypes.push("Site Page");
    itemCreateableTypes.push("Site Application");
  } else {
    // Otherwise we infer they are running on AGO, and can
    // the types are "hub site applications" and "hub pages"
    itemCreateableTypes.push("Hub Page");
    itemCreateableTypes.push("Hub Site Application");
  }

  const eventCreateableTypes = ["Event"];
  const groupCreateableTypes = ["Group"];

  let response: string[] = [];
  if (limitTo.length) {
    if (limitTo.includes("item")) {
      response = itemCreateableTypes;
    }
    if (limitTo.includes("event")) {
      response = [...response, ...eventCreateableTypes];
    }
    if (limitTo.includes("group")) {
      response = [...response, ...groupCreateableTypes];
    }
  } else {
    response = [
      ...itemCreateableTypes,
      ...eventCreateableTypes,
      ...groupCreateableTypes,
    ];
  }

  response = response.sort((a, b) => {
    const aIdx = prescribedOrder.indexOf(a);
    const bIdx = prescribedOrder.indexOf(b);
    return aIdx - bIdx;
  });

  return response;
}

/**
 * @internal
 * Define the content types and their workflows
 * Note: This does not include non-item backed types like Event or Group
 * which are handled separately in getQueryContentConfig
 * Note: This is not exported from the package so changes are non-breaking
 * in terms of semver.
 */
const TypeWorkflowDefinitions: ITypeWorkflowDefinition[] = [
  {
    type: "Discussion",
    targetEntity: "item",
    permission: "hub:discussion:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Project",
    targetEntity: "item",
    permission: "hub:project:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Page",
    targetEntity: "item",
    permission: "hub:page:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Site Page",
    targetEntity: "item",
    permission: "hub:page:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Initiative",
    targetEntity: "item",
    permission: "hub:initiative:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Site Application",
    targetEntity: "item",
    permission: "hub:site:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Site Application",
    targetEntity: "item",
    permission: "hub:site:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Group",
    targetEntity: "group",
    permission: "hub:group:create",
    workflows: ["create"],
  },
  {
    type: "Event",
    targetEntity: "event",
    permission: "hub:event:create",
    workflows: ["create", "existing"],
  },

  {
    // Documents will be uploadable / creatable by Hub
    // so this entry exists separate from the others
    // which will be created in AGO, and just ADDED
    // via Hub
    type: "$document",
    targetEntity: "item",
    permission: "hub:content:document:create",
    workflows: ["upload", "existing"],
  },
  // Anything that just has existing really just needs
  // to check if the user has the permission to share
  // which we can do with the platform permission vs having
  // to define a specific permission for each type
  {
    type: "$application",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$feedback",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$dashboard",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$dataset",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$experience",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$storymap",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$webmap",
    targetEntity: "item",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
];
