/**
 * @private
 * Template permissions: these define the requirements
 * any user must meet to perform related actions
 */
export const TemplatePermissions = [
  "hub:template",
  "hub:template:create",
  "hub:template:delete",
  "hub:template:edit",
  "hub:template:manage",
  "hub:template:view",
  "hub:template:view:related",
  "hub:template:canChangeAccess",
  "hub:template:workspace",
  "hub:template:workspace:details",
  "hub:template:workspace:dashboard",
  "hub:template:workspace:collaborators",
  "hub:template:workspace:settings",
] as const;
