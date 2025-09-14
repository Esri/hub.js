/**
 * Group Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const GroupPermissions = [
  "hub:group",
  "hub:group:create",
  "hub:group:create:view",
  "hub:group:create:edit",
  "hub:group:delete",
  "hub:group:edit",
  "hub:group:view",
  "hub:group:owner",
  "hub:group:canChangeAccess",
  "hub:group:canAssignMembers",
  "hub:group:workspace",
  "hub:group:workspace:overview",
  "hub:group:workspace:dashboard",
  "hub:group:workspace:details",
  "hub:group:workspace:settings",
  "hub:group:settings:discussions",
  "hub:group:workspace:collaborators",
  "hub:group:workspace:content",
  "hub:group:workspace:members",
  "hub:group:workspace:events",
  "hub:group:shareContent",
  "hub:group:manage",
] as const;
