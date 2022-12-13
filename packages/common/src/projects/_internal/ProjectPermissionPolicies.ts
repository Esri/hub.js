import { IPermissionPolicy } from "../../permissions/types";

/**
 * Project Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ProjectPermissions = [
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
] as const;

export const ProjectPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:project:create",
    subsystems: ["projects"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:view",
    subsystems: ["projects"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:edit",
    authenticated: true,
    subsystems: ["projects"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:delete",
    authenticated: true,
    subsystems: ["projects"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
