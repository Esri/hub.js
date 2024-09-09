import { IPermissionPolicy } from "../../permissions";

/**
 * User Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const UserPermissions = [
  "hub:user",
  "hub:user:view",
  "hub:user:edit",
  "hub:user:owner",
  "hub:user:workspace",
  "hub:user:workspace:overview",
  "hub:user:workspace:settings",
  "hub:user:manage",
] as const;

/**
 * User permission policies
 * @private
 */
export const UserPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:user",
    services: ["portal"],
  },
  {
    permission: "hub:user:view",
    dependencies: ["hub:user"],
    authenticated: false,
  },
  {
    permission: "hub:user:owner",
    dependencies: ["hub:user"],
    authenticated: true,
    entityOwner: true,
  },
  {
    permission: "hub:user:edit",
    // NOTE: most entities base this on entityEdit: true,
    // but for now at least we are requiring the user to be themselves
    dependencies: ["hub:user:owner"],
  },
  {
    permission: "hub:user:workspace",
    environments: ["qaext", "devext"],
    // seems like this should also depend on hub:user,
    // but other entities don't do that
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:user:workspace:overview",
    // NOTE: other entities like site, group, and content gate this to alpha
    // but at least for now this is the only pane for users, so no gating
    // availability: ["alpha"],
    dependencies: ["hub:user:workspace", "hub:user:view"],
  },
  {
    permission: "hub:user:workspace:settings",
    dependencies: ["hub:user:workspace", "hub:user:edit"],
  },
  {
    permission: "hub:user:manage",
    dependencies: ["hub:user:edit"],
  },
];
