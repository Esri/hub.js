/**
 * Initiative Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativePermissions = [
  "hub:initiative",
  "hub:initiative:create",
  "hub:initiative:delete",
  "hub:initiative:edit",
  "hub:initiative:view",
  "hub:initiative:owner",
  "hub:initiative:canChangeAccess",
  "hub:initiative:events",
  "hub:initiative:content",
  "hub:initiative:discussions",
  "hub:initiative:workspace",
  "hub:initiative:workspace:overview",
  "hub:initiative:workspace:dashboard",
  "hub:initiative:workspace:details",
  "hub:initiative:workspace:metrics",
  "hub:initiative:workspace:projects",
  "hub:initiative:workspace:projects:member",
  "hub:initiative:workspace:projects:manager",
  "hub:initiative:workspace:settings",
  "hub:initiative:workspace:collaborators",
  "hub:initiative:workspace:metrics",
  "hub:initiative:workspace:catalogs", // deprecated -- should be removed
  "hub:initiative:workspace:catalog",
  "hub:initiative:workspace:catalog:content",
  "hub:initiative:workspace:catalog:events",
  "hub:initiative:workspace:associationGroup:create",
  "hub:initiative:manage",
] as const;
