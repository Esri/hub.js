/**
 * Project Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ProjectPermissions = [
  "hub:project",
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
  "hub:project:owner",
  "hub:project:canChangeAccess",
  "hub:project:events",
  "hub:project:content",
  "hub:project:discussions",
  "hub:project:associations",
  "hub:project:workspace",
  "hub:project:workspace:overview",
  "hub:project:workspace:dashboard",
  "hub:project:workspace:details",
  "hub:project:workspace:initiatives",
  "hub:project:workspace:settings",
  "hub:project:workspace:collaborators",
  "hub:project:workspace:events",
  "hub:project:workspace:metrics",
  "hub:project:workspace:catalog",
  "hub:project:workspace:catalog:content",
  "hub:project:workspace:catalog:events",
  "hub:project:manage",
] as const;
