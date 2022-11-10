import { IPermissionPolicy } from "../../permissions/types";

/**
 * Project Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
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
    subsystems: ["project"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:edit",
    authenticated: true,
    subsystems: ["project"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:delete",
    authenticated: true,
    subsystems: ["project"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
];
