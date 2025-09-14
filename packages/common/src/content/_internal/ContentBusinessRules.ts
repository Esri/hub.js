import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Content item. Intentionally empty to prevent overriding and adding features
 */
export const ContentDefaultFeatures: IFeatureFlags = {
  // Intentally empty as this prevents overriding and adding features
};

/**
 * Content permission policies
 * No need to specify license for permissions that are available to all licenses
 * @private
 */
export const ContentPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:content",
    services: ["portal"],
  },
  {
    permission: "hub:content:create",
    services: ["portal"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:content:view",
    services: ["portal"],
    authenticated: false,
  },
  {
    permission: "hub:content:view:related",
    dependencies: ["hub:content:view"],
    services: ["hub-search"],
    assertions: [
      {
        property: "entity:access",
        type: "eq",
        value: "public",
      },
    ],
  },
  // NOTE: The connected content feature is only available for individual _feature layers_ within
  // a feature / map service. Consumers of this permission are in charge of ensuring that the user
  // is viewing a feature layer within a feature / map service before applying this permission.
  {
    permission: "hub:content:view:connected",
    dependencies: ["hub:content:view"],
    services: ["hub-search"],
    assertions: [
      {
        property: "entity:access",
        type: "eq",
        value: "public",
      },
      {
        property: "entity:type",
        type: "included-in",
        value: ["Feature Service", "Map Service"],
      },
    ],
  },
  {
    permission: "hub:content:edit",
    authenticated: true,
    services: ["portal"],
    entityEdit: true,
  },
  {
    permission: "hub:content:delete",
    authenticated: true,
    services: ["portal"],
    entityDelete: true,
  },
  {
    permission: "hub:content:canChangeAccess",
    dependencies: ["hub:content"],
    authenticated: true,
    assertions: [
      {
        property: "context:currentUser.privileges",
        type: "contains-some",
        value: [
          "portal:admin:shareToPublic",
          "portal:admin:shareToOrg",
          "portal:user:shareToPublic",
          "portal:user:shareToOrg",
        ],
      },
      {
        property: "entity:itemControl",
        type: "eq",
        value: "admin",
      },
    ],
  },
  {
    permission: "hub:content:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:content:workspace:overview",
    availability: ["alpha"],
    dependencies: ["hub:content:workspace", "hub:content:view"],
  },
  {
    permission: "hub:content:workspace:dashboard",
    dependencies: ["hub:content:workspace", "hub:content:view"],
  },
  {
    permission: "hub:content:workspace:details",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:workspace:settings",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:workspace:settings:schedule",
    dependencies: ["hub:content:workspace:settings"],
    environments: ["devext", "qaext", "production"],
    services: ["hub-downloads"],
  },
  {
    permission: "hub:content:workspace:collaborators",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:manage",
    dependencies: ["hub:content:edit"],
  },
  {
    permission: "hub:content:canRecordDownloadErrors",
    environments: ["qaext", "devext"],
  },
  {
    permission: "hub:content:downloads:displayErrors",
    availability: ["alpha"],
    environments: ["qaext", "devext"],
  },
  // Specific permission for creating documents
  {
    permission: "hub:content:document:create",
    dependencies: ["hub:content:create"],
  },
  {
    permission: "hub:content:workspace:settings:discussions",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
    licenses: ["hub-basic", "hub-premium"],
  },
];
