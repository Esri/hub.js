/**
 * Discussion Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const DiscussionPermissions = [
  "hub:discussion",
  "hub:discussion:create",
  "hub:discussion:delete",
  "hub:discussion:edit",
  "hub:discussion:view",
  "hub:discussion:owner",
  "hub:discussion:canChangeAccess",
  "hub:discussion:workspace:overview",
  "hub:discussion:workspace:dashboard",
  "hub:discussion:workspace:details",
  "hub:discussion:workspace:settings",
  "hub:discussion:workspace:collaborators",
  "hub:discussion:workspace:metrics",
  "hub:discussion:workspace:settings:discussions",
  "hub:discussion:manage",
  "temp:hub:discussion:create",
  "hub:discussion:workspace:catalog",
  "hub:discussion:workspace:catalog:content",
  "hub:discussion:workspace:catalog:events",
] as const;
