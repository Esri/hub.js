import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../../permissions/checkPermission";
import { Permission } from "../../permissions/types/Permission";
import { cloneObject } from "../../util";

/**
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
 * @internal
 * Define the workflows
 */
export type ContentWorkflow = "create" | "upload" | "existing";

/**
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
 * Return a list of types to use as the "default" types a user could possibly
 * create / add (depending on permissions and group access).
 * This list is used when an IQuery does not have type predicates, which
 * we interpret as "all types", which is this list.
 * @param context
 * @returns
 */
export function getDefaultCreateableTypes(context: IArcGISContext): string[] {
  const defaultCreatableTypes = [
    "Hub Project",
    "Hub Initiative",
    "Discussion",
    "Event",
  ];
  // If the user has the hub:license:enterprise-sites permission
  // they are on Enterprise and the types are "site applications" and "site pages"
  if (checkPermission("hub:environment:enterprise", context).access) {
    defaultCreatableTypes.push("Site Application");
    defaultCreatableTypes.push("Site Page");
  } else {
    // Otherwise we infer they are running on AGO, and can
    // the types are "hub site applications" and "hub pages"
    defaultCreatableTypes.push("Hub Site Application");
    defaultCreatableTypes.push("Hub Page");
  }
  return defaultCreatableTypes;
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
    permission: "hub:discussion:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Project",
    permission: "hub:project:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Page",
    permission: "hub:page:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Site Page",
    permission: "hub:page:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Initiative",
    permission: "hub:initiative:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Hub Site Application",
    permission: "hub:site:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Site Application",
    permission: "hub:site:create",
    workflows: ["create", "existing"],
  },
  {
    type: "Group",
    permission: "hub:group:create",
    workflows: ["create"],
  },
  {
    type: "Event",
    permission: "hub:event:create",
    workflows: ["create", "existing"],
  },

  {
    // Documents will be uploadable / creatable by Hub
    // so this entry exists separate from the others
    // which will be created in AGO, and just ADDED
    // via Hub
    type: "$document",
    permission: "hub:content:document:create",
    workflows: ["upload", "existing"],
  },
  // Anything that just has existing really just needs
  // to check if the user has the permission to share
  // which we can do with the platform permission vs having
  // to define a specific permission for each type
  {
    type: "$application",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$feedback",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$dashboard",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$dataset",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$experience",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$storymap",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
  {
    type: "$webmap",
    permission: "platform:portal:user:shareToGroup",
    workflows: ["existing"],
  },
];
