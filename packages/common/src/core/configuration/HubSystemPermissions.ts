import { HubLicense } from "../licensing";

/**
 * Platform requirements for a specific permission.
 */
export interface IPermissionDefinition {
  id: Permission;
  platform?: IPlatformChecks;
  licenses?: HubLicense[];
  result?: IPermissionResult;
  context?: string;
  target?: string;
  checks?: ICheck[];
}

export interface IPermissionResult {
  access: boolean;
  reason?: PermissionCheckReason;
}

export interface ICheck {
  check: string;
  value: string;
  result: "pass" | "fail" | "skip";
}
export interface IPlatformChecks {
  privileges?: PlatformPrivilege[];
  roles?: string[];
  edit?: boolean;
  owner?: boolean;
}

export type PermissionCheckReason =
  | "granted" // user has access
  | "offline" // subsystem is offline
  | "org-member" // user is member of granted org
  | "not-org-member" // user is not member of granted org
  | "group-member" // user is member of granted org
  | "not-group-member" // user is member of granted org
  | "direct-user" // user is granted directly
  | "not-owner" // user is not the owner
  | "not-licensed" // license not available in this context
  | "not-available" // permission not available in this context
  | "not-granted" // user does not have permission
  | "no-edit-access" // user does not have edit access
  | "invalid-permission" // permission is invalid
  | "no-entity-permission" // entity permissions block access
  | "missing-privilege"; // user does not have required privilege

export interface IEntityPermissionDefinition {
  id: Permission;
  context: string;
  target: string;
}

// THIS MUST BE KEPT IN SYNC WITH HubCapability
// This can be separated out by type for simpler management
const validPermissions = [
  "hub:site:create",
  "hub:site:view",
  "hub:site:delete",
  "hub:site:edit",
  "hub:page:create",
  "hub:page:delete",
  "hub:page:edit",
  "hub:page:view",
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
  "hub:catalog:manage",
] as const;
export type Permission = typeof validPermissions[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission as Permission);
}

// TODO: In the future this will get unweidly so we can split into separate files and
// simplty merge them together here
export const HubSystemPermissions: IPermissionDefinition[] = [
  {
    id: "hub:site:create",
    platform: {
      privileges: ["portal:user:createItem"],
    },
    licenses: ["basic", "premium", "enterprise"],
  },
  {
    id: "hub:site:view",
    licenses: ["basic", "premium", "enterprise"],
  },
  {
    id: "hub:site:delete",
    platform: {
      owner: true,
    },
    licenses: ["basic", "premium", "enterprise"],
  },
  {
    id: "hub:site:edit",
    platform: {
      edit: true,
    },
    licenses: ["basic", "premium", "enterprise"],
  },
  {
    id: "hub:project:create",
    platform: {
      privileges: ["portal:user:createItem"],
    },
    licenses: ["premium"],
  },
  {
    id: "hub:project:view",
    licenses: ["premium"],
  },
  {
    id: "hub:project:edit",
    platform: {
      edit: true,
    },
    licenses: ["premium"],
  },
  {
    id: "hub:project:delete",
    platform: {
      owner: true,
    },
    licenses: ["premium"],
  },
];

type PlatformPrivilege =
  | "opendata:user:designateGroup"
  | "opendata:user:openDataAdmin"
  | "portal:admin:assignToGroups"
  | "portal:admin:categorizeItems"
  | "portal:admin:changeUserRoles"
  | "portal:admin:createGPWebhook"
  | "portal:admin:createUpdateCapableGroup"
  | "portal:admin:deleteGroups"
  | "portal:admin:deleteItems"
  | "portal:admin:deleteUsers"
  | "portal:admin:disableUsers"
  | "portal:admin:inviteUsers"
  | "portal:admin:manageCollaborations"
  | "portal:admin:manageCredits"
  | "portal:admin:manageEnterpriseGroups"
  | "portal:admin:manageLicenses"
  | "portal:admin:manageRoles"
  | "portal:admin:manageSecurity"
  | "portal:admin:manageServers"
  | "portal:admin:manageUtilityServices"
  | "portal:admin:manageWebhooks"
  | "portal:admin:manageWebsite"
  | "portal:admin:reassignGroups"
  | "portal:admin:reassignItems"
  | "portal:admin:reassignUsers"
  | "portal:admin:shareToGroup"
  | "portal:admin:shareToOrg"
  | "portal:admin:shareToPublic"
  | "portal:admin:updateGroups"
  | "portal:admin:updateItemCategorySchema"
  | "portal:admin:updateItems"
  | "portal:admin:updateMemberCategorySchema"
  | "portal:admin:updateUsers"
  | "portal:admin:viewGroups"
  | "portal:admin:viewItems"
  | "portal:admin:viewUsers"
  | "portal:publisher:bulkPublishFromDataStores"
  | "portal:publisher:createFeatureWebhook"
  | "portal:publisher:publishBigDataAnalytics"
  | "portal:publisher:publishDynamicImagery"
  | "portal:publisher:publishFeatures"
  | "portal:publisher:publishFeeds"
  | "portal:publisher:publishKnowledgeGraph"
  | "portal:publisher:publishRealTimeAnalytics"
  | "portal:publisher:publishScenes"
  | "portal:publisher:publishServerGPServices"
  | "portal:publisher:publishServerServices"
  | "portal:publisher:publishTiledImagery"
  | "portal:publisher:publishTiles"
  | "portal:publisher:registerDataStores"
  | "portal:user:addExternalMembersToGroup"
  | "portal:user:categorizeItems"
  | "portal:user:createGroup"
  | "portal:user:createItem"
  | "portal:user:invitePartneredCollaborationMembers"
  | "portal:user:joinGroup"
  | "portal:user:joinNonOrgGroup"
  | "portal:user:reassignItems"
  | "portal:user:receiveItems"
  | "portal:user:runWebTool"
  | "portal:user:shareGroupToOrg"
  | "portal:user:shareGroupToPublic"
  | "portal:user:shareToGroup"
  | "portal:user:shareToOrg"
  | "portal:user:shareToPublic"
  | "portal:user:viewHostedFeatureServices"
  | "portal:user:viewHostedTileServices"
  | "portal:user:viewOrgGroups"
  | "portal:user:viewOrgItems"
  | "portal:user:viewOrgUsers"
  | "portal:user:viewTracks";
