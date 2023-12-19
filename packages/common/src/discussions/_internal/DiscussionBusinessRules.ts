import { IPermissionPolicy } from "../../permissions";

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
  "hub:discussion:workspace:overview",
  "hub:discussion:workspace:dashboard",
  "hub:discussion:workspace:details",
  "hub:discussion:workspace:settings",
  "hub:discussion:workspace:collaborators",
  "hub:discussion:workspace:discussion",
  "hub:discussion:workspace:metrics",
  "hub:discussion:manage",
  "temp:hub:discussion:create",
] as const;

/**
 * Discussion permission policies
 * @private
 */
export const DiscussionPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:discussion",
    services: ["discussions"],
  },
  {
    permission: "hub:discussion:create",
    dependencies: ["hub:discussion"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:view",
    dependencies: ["hub:discussion"],
    authenticated: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:edit",
    authenticated: true,
    dependencies: ["hub:discussion"],
    entityEdit: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:delete",
    authenticated: true,
    dependencies: ["hub:discussion"],
    entityOwner: true,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:discussion:workspace:overview",
    dependencies: ["hub:discussion:view"],
  },
  {
    permission: "hub:discussion:workspace:dashboard",
    dependencies: ["hub:discussion:view"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:discussion:workspace:details",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:settings",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:collaborators",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:discussion",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:workspace:metrics",
    dependencies: ["hub:discussion:edit"],
  },
  {
    permission: "hub:discussion:manage",
    dependencies: ["hub:discussion:edit"],
  },
  // Temporary gated creation of new discussion boards
  {
    permission: "temp:hub:discussion:create",
    dependencies: ["hub:discussion:create"],
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
];
