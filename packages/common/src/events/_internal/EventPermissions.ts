/**
 * @private
 * Event Permission Policies
 * These define the requirements any user must meet to perform related actions
 */
export const EventPermissions = [
  "hub:event",
  "hub:event:create",
  "hub:event:edit",
  "hub:event:delete",
  "hub:event:view",
  "hub:event:owner",
  "hub:event:canChangeAccess",
  "hub:event:workspace",
  "hub:event:workspace:dashboard",
  "hub:event:workspace:details",
  "hub:event:workspace:settings",
  "hub:event:workspace:collaborators",
  "hub:event:workspace:manage",
  "hub:event:workspace:registrants",
  "hub:event:workspace:content",
  "hub:event:workspace:catalog",
  "hub:event:workspace:catalog:content",
  "hub:event:workspace:catalog:events",
  "hub:event:manage",
] as const;
