import { IPermissionPolicy } from "../../permissions/types/IPermissionPolicy";

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
    // seems like this should also depend on hub:user,
    // but other entities don't do that
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:user:workspace:overview",
    dependencies: ["hub:user:workspace"],
  },
  {
    permission: "hub:user:workspace:content",
    dependencies: ["hub:user:workspace", "hub:user:owner"],
  },
  {
    permission: "hub:user:workspace:groups",
    dependencies: ["hub:user:workspace", "hub:user:owner"],
  },
  {
    permission: "hub:user:workspace:events",
    services: ["events"],
    dependencies: ["hub:user:workspace", "hub:user:owner"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:user:workspace:settings",
    environments: ["devext", "qaext", "production"], // Enterprise intentionally omitted for v12
    dependencies: ["hub:user:workspace", "hub:user:owner"],
  },
  {
    permission: "hub:user:workspace:members",
    dependencies: ["hub:user:workspace"],
    licenses: ["hub-premium"],
    environments: ["qaext"], // as per issue 14442, this should NOT be available in Enterprise
    // Starting with full org admin as there are not specific privileges for messaging users
    assertions: [
      {
        property: "context:currentUser.role",
        type: "eq",
        value: "org_admin",
      },
    ],
  },
  {
    permission: "hub:user:manage",
    dependencies: ["hub:user:edit"],
  },
];
