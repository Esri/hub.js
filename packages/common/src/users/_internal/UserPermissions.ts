/**
 * User Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const UserPermissions = [
  "hub:user",
  "hub:user:view",
  "hub:user:edit",
  "hub:user:owner",
  "hub:user:workspace",
  "hub:user:workspace:overview",
  "hub:user:workspace:settings",
  "hub:user:workspace:content",
  "hub:user:workspace:groups",
  "hub:user:workspace:events",
  "hub:user:workspace:shared-with-me",
  "hub:user:manage",
] as const;
