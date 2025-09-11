/**
 * Content Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ContentPermissions = [
  "hub:content",
  "hub:content:create",
  "hub:content:delete",
  "hub:content:edit",
  "hub:content:view",
  "hub:content:view:related",
  "hub:content:view:connected",
  "hub:content:canChangeAccess",
  "hub:content:workspace",
  "hub:content:workspace:overview",
  "hub:content:workspace:dashboard",
  "hub:content:workspace:details",
  "hub:content:workspace:settings",
  "hub:content:workspace:settings:schedule",
  "hub:content:workspace:settings:discussions",
  "hub:content:workspace:collaborators",
  "hub:content:manage",
  "hub:content:canRecordDownloadErrors",
  "hub:content:downloads:displayErrors",
  "hub:content:document:create",
] as const;
