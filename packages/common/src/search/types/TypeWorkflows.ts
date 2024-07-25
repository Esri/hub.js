import { Permission } from "../../permissions/types/Permission";

/**
 * @internal
 * Structure that defines the permission checks and workflows for each content type
 */
export interface IContentTypeWorkflow {
  type: string;
  permission: Permission;
  workflows: ContentWorkflow[];
}

/**
 * @internal
 * Define the workflows
 */
export type ContentWorkflow = "create" | "upload" | "existing";

/**
 * @internal
 * Define the content types and their workflows
 * Note: This does not include non-item backed types like Event or Group
 * which are handled separately in getQueryContentConfig
 * Note: This is not exported from the package so changes are non-breaking
 * in terms of semver.
 */
export const ContentTypeWorkflows = [
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
    // Documents will be uploadable / creatable by Hub
    // so this entry exists separate from the others
    // which will be created in AGO, and just ADDED
    // via Hub
    type: "document",
    // TODO: Create hub:document:create permission
    // that checks :createItem and :shareToGroup
    permission: "platform:portal:user:shareToGroup",
    workflows: ["upload", "existing"],
  },
  // Anything that just has existing really just needs
  // to check if the user has the permission to share
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
