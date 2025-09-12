/**
 * Page Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const PagePermissions = [
  "hub:page",
  "hub:page:create",
  "hub:page:delete",
  "hub:page:edit",
  "hub:page:view",
  "hub:page:canChangeAccess",
  "hub:page:workspace",
  "hub:page:workspace:overview",
  "hub:page:workspace:dashboard",
  "hub:page:workspace:details",
  "hub:page:workspace:settings",
  "hub:page:workspace:collaborators",
  "hub:page:manage",
] as const;
