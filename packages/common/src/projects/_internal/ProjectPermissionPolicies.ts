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
    subsystems: ["projects"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:edit",
    authenticated: true,
    subsystems: ["projects"],
    assertions: [
      {
        property: "canEdit",
        assertion: "eq",
        valueType: "static",
        value: true,
      },
    ],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:delete",
    authenticated: true,
    subsystems: ["projects"],
    licenses: ["hub-premium"],
    assertions: [
      {
        property: "owner",
        assertion: "eq",
        valueType: "context-lookup",
        value: "currentUser.username",
      },
    ],
  },
];
