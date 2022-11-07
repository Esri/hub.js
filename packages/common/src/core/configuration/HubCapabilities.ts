/**
 * Defines the capabilities available in ArcGIS Hub.
 * These values are used throughout the configuration and permission
 * systems to define what actions are available to users.
 */
export type HubCapability =
  | "sites"
  | "pages"
  | "events"
  | "projects"
  | "initiatives"
  | "discussions"
  | "metrics"
  | "catalogs"
  | "collaborations"
  | "teams";

/**
 * Definition of the actions that are exposed for a specific capability.
 * These are used in permission id's as `hub:{capability}:{action}`
 */
export const HubCapabilityActions = {
  // Initially we are using very coarse grained actions
  sites: ["create", "delete", "edit"],
  pages: ["create", "delete", "edit"],
  projects: ["create", "delete", "edit"],
  // more fine grained actions are possible in the future
  // NOT IMPLEMENTED YET
  initiatives: [
    "create",
    "delete",
    "editSettings",
    "manageProjects",
    "manageCatalog",
    "manageEvents",
    "manageDiscussions",
    "manageCollaboration",
    "manageFollowers",
  ],
  discussions: [
    "createChannel",
    "deleteChannel",
    "moderateChannel",
    "readChannel",
    "postChannel",
  ],
  catalogs: ["addGroups", "removeGroups"],
  collaborations: [
    "addTeams",
    "removeTeams",
    "addUsers",
    "removeUsers",
    "managePermissions",
  ],
  events: ["create", "delete", "edit", "manageCatalog", "manageDiscussions"],
  teams: ["message"],
  metrics: ["view", "editSettings"],
};
