import { IPermissionPolicy } from "../../permissions";

/**
 * Feedback Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const FeedbackPermissions = [
  "hub:feedback",
  "hub:feedback:create",
  "hub:feedback:delete",
  "hub:feedback:edit",
  "hub:feedback:view",
  "hub:feedback:workspace:dashboard",
  "hub:feedback:workspace:details",
  "hub:feedback:workspace:settings",
  "hub:feedback:manage",
] as const;

/**
 * Feedback permission policies
 * @private
 */
export const FeedbackPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:feedback",
    services: ["portal"],
  },
  {
    permission: "hub:feedback:view",
    dependencies: ["hub:feedback"],
  },
  {
    permission: "hub:feedback:create",
    authenticated: true,
    dependencies: ["hub:feedback"],
    entityEdit: true,
  },
  {
    permission: "hub:feedback:edit",
    authenticated: true,
    dependencies: ["hub:feedback"],
    entityEdit: true,
  },
  {
    permission: "hub:feedback:delete",
    authenticated: true,
    dependencies: ["hub:feedback"],
    entityOwner: true,
  },
  {
    permission: "hub:feedback:workspace:dashboard",
    dependencies: ["hub:feedback:view"],
  },
  {
    permission: "hub:feedback:workspace:details",
    dependencies: ["hub:feedback:edit"],
  },
  {
    permission: "hub:feedback:workspace:settings",
    dependencies: ["hub:feedback:edit"],
  },
  {
    permission: "hub:feedback:manage",
    dependencies: ["hub:feedback:edit"],
  },
];
