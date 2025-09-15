/**
 * Initiative Template Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativeTemplatePermissions = [
  "hub:initiativeTemplate",
  "hub:initiativeTemplate:create",
  "hub:initiativeTemplate:delete",
  "hub:initiativeTemplate:edit",
  "hub:initiativeTemplate:view",
  "hub:initiativeTemplate:view:related",
  "hub:initiativeTemplate:canChangeAccess",
  "hub:initiativeTemplate:workspace",
  "hub:initiativeTemplate:workspace:dashboard",
  "hub:initiativeTemplate:workspace:details",
  "hub:initiativeTemplate:workspace:collaborators",
  "hub:initiativeTemplate:workspace:settings",
  "hub:initiativeTemplate:manage",
] as const;
