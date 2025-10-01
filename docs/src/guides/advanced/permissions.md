---
title: Permissions and Access Controls
navTitle: Permissions
description: Checking Access
order: 19
group: 4-advanced
---

## Permissions

ArcGIS Hub uses a single, centralized permission system to determine access to functionality within the application.

Permissions are defined by `IPermissionPolicy` objects, which represent platform business rules. These are stored in `<Entity>BusinessRules.ts` modules and should not be exported from Hub.js.

For an overview of how permissions work, see the [Access Control Guide](../access-control).

### Permission Policy Properties

- **permission**: Permission identifier, e.g. `hub:projects:create`
- **dependencies**: Array of other permissions this permission depends on. This allows for hierarchies and reduces duplication. Keep these shallow—at most 3 levels deep.
- **services**: Services that must be online for this policy.
- **authenticated**: Must the user be authenticated?
- **privileges**: Platform-level privileges required, e.g. `portal:user:createItem`. The user must have all specified privileges.
- **entityOwner**: Does this policy require the user to be the owner of the entity?
- **entityEdit**: Does this policy require the user to be able to edit the entity?
- **licenses**: Required Hub licenses. Specify only if the permission is limited to certain licenses.
- **availability**: `alpha`, `beta`, or `general` availability. Can be overridden by passing `?pe=permission:to:enable` in the URI.
- **environments**: `devext`, `qaext`, `production`, etc. Can be overridden by passing `?pe=permission:to:enable` in the URI.
- **assertions**: Additional checks for custom scenarios not covered by other properties.
- **entityConfigurable**: Can an entity enable/disable this permission?
- **releaseAfter**: ISO date after which the permission is enabled (production only).
- **retireAfter**: ISO date after which the permission is disabled (for deprecating functionality).
- **portalVersion**: Numeric portal version (`2025.3`) after which the permission is enabled (for synchronizing releases with ArcGIS Online).

See the [`IPermissionPolicy` documentation](/hub.js/api/common/IPermissionPolicy/) for a full list of properties and detailed definitions.

#### Example Annotated Policy

```js
// This is an example - there are many more Site permissions
export const SitesPermissionPolicies: IPermissionPolicy[] = [
  {
    // Top level policy
    permission: "hub:site",
    services: ["portal"],
    // since sites are available for all license levels
    // we don't need to specify any licenses
  },
  {
    permission: "hub:site:edit",
    // this permission depends on hub:site
    dependencies: ["hub:site"],
    // and adds a requirement that the user be
    // authenticated, and have edit access to the site
    authenticated: true,
    entityEdit: true,
  },
  {
    // this permission controls access to the domain editing UX
    permission: "hub:site:edit:domain",
    // by default, it's the same as hub:site:edit
    // but by having a separate permission, the site can
    // add more rules... see the next section
    dependencies: ["hub:site:edit"],
    // we also stipulate that it depends on the domains service
    // so if that's down, we can have a gracefully degraded UX
    services: ["domains"],
  },
  {
    permission: "hub:site:workspace:followers:manager",
    dependencies: ["hub:site:edit"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:followersGroupId",
      },
    ],
  },
  {
    // Example of a new feature...
    permission: "hub:site:workspace:chat",
    // that requires edit access
    dependencies: ["hub:site:edit"],
    // hub-premium license and is gated to alpha orgs in qaext
    licenses: ["hub-premium"],
    availability: ["alpha"],
    environments: ["qaext"],
    // this allows a site entity to turn this off
    // see Entity Feature Flags below
    entityConfigurable: true,
  },
  {
    // Example of a new feature tied to an ArcGIS Online release
    permission: "hub:site:discussion:mapview",
    dependencies: ["hub:site:edit", "hub:release:2026R1"],
    licenses: ["hub-premium"],
  },
];
```

### Entity Permission Policies

Entities can add additional gating for specific permissions. For example, a Site owner (`jsmith`) may limit domain editing to themselves by adding an `IEntityPermissionPolicy` to the `.permissions` array.

```js
site.permissions = [
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "jsmith",
  },
];
```

Entity Permission Policies are more limited than full `IPermissionPolicy` objects, but cover many collaboration scenarios:

- Is the current user a member of a specified group?
- Is the current user a member of a specified org?
- Is the current user specifically granted access by name?

Entities can define multiple policies for the same permission; only one needs to pass.

```js
site.permissions = [
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "jsmith",
  },
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "dvader",
  },
];
```

### Entity Features

Entities can disable features (represented by permissions) by adding a key for the permission to the `entity.features` hash. Only permissions with `.entityConfigurable: true` are read from this hash, ensuring general business rules cannot be overridden.

```js
site.features = {
  "hub:site:workspace:chat": false,
  // Only read if entityConfigurable: true on the permission policy
};
```

### System Feature Flags

Hub.js supports system feature flags, passed into `ArcGISContextManager.create(...)` as part of the options. The host application parses values from the URL.

System Feature Flags override Entity Feature flags and the `availability` and `environment` checks. They cannot override license checks or core platform privileges.

These are typically used to demonstrate upcoming features in customer Production orgs, even if gated to `qaext`.

Feature Flags are reset when the user signs out.

### System Service Flags

Permission policies can list dependent services. To test graceful degradation UX, you can simulate a service being offline using Service Flags, passed into `ArcGISContextManager.create(...)` as options. These override live status information and are reset on sign out.

### Feature Gating & User Opt-in/out

During development, features are often gated—accessible only with a specific URI parameter or in certain environments/availability modes (e.g., "alpha"). As release approaches, users may opt in to preview features. After general release, users may opt out for a limited time.

#### Defining Gating and Feature Permissions

Define both "gating" and "feature" permissions:

```js
{
  permission: "hub:gating:workspace:released",
  availability: ["alpha"],
  environments: ["devext", "qaext", "production"],
},
{
  permission: "hub:feature:workspace",
  dependencies: ["hub:gating:workspace:released"],
},
```

#### User Opt-in/Opt-out

When users can opt in, provide a UI that updates the `IUserHubSettings.features` object. Initially, users are opted out by default:

```json
{
  "features": {
    "workspace": false
  }
}
```

To release the feature to all users, remove conditions from the gating permission:

```js
{
  permission: "hub:gating:workspace:released",
},
{
  permission: "hub:feature:workspace",
  dependencies: ["hub:gating:workspace:released"],
},
```

Update `getDefaultUserHubSettings(...)` so the feature is opted in by default:

```js
{
  schemaVersion: 1.1,
  username,
  updated: new Date().getTime(),
  features: {
    workspace: true,
  },
}
```

Update the UI to reflect general availability. The boolean value should remain consistent: `true` means the user has the feature, `false` means they do not.

#### Ending the Opt-out Period

When the opt-out period ends, apply a schema migration to remove the feature property from `IUserHubSettings.features`. This prevents users from opting out and allows removal of legacy code.

### Checking Permission Access

Permissions can be checked directly on an Entity instance via `instance.checkPermission(permission)`. If you don’t have access to an Entity instance, use `checkPermission(permission, context, entity?)`.

```jsx
checkPermission("hub:events:create", entity, context);
//=> {permission: "hub:events:create", access: false, response: "not-group-member", checks: [...]}

site.checkPermission("hub:pages:create");
//=> {permission: "hub:pages:create", access: true, response: "group-member", checks: [...]}
```

Both return an `IPermissionAccessResponse`. The most important property is `.access`, indicating if the current user has access. Other properties provide debugging and observability into why `.access` is returned, and can be used to display different messages.

For example, `.result` will be `granted` if access is allowed; if denied, it will be more informative.

Some key values:

- **not-licensed-available**: Feature is available, but user lacks a license. Opportunity to show an upgrade call-to-action.
- **service-offline**: Required service is offline. Application can show a general error or continue with degraded experience.
- **service-not-available**: Service is not available in the current environment. Useful for gating features not yet in Enterprise.

Most other values are specific to policy check failures.

| `result` Value                      | Description                                            |
| ----------------------------------- | ------------------------------------------------------ |
| "granted"                           | user has access                                        |
| "disabled-by-feature-flag"          | access denied due to a flag                            |
| "disabled-by-entity-flag"           | access denied due to a flag                            |
| "org-member"                        | user is member of granted org                          |
| "not-org-member"                    | user is not member of granted org                      |
| "group-member"                      | user is member of granted group                        |
| "not-group-member"                  | user is not member of granted group                    |
| "not-group-admin"                   | user is not admin member of granted group              |
| "is-user"                           | user is granted directly                               |
| "not-owner"                         | user is not the owner                                  |
| "not-licensed"                      | user is not licensed                                   |
| "not-licensed-available"            | user is not licensed, but could be                     |
| "not-available"                     | permission not available in this context               |
| "not-granted"                       | user does not have permission                          |
| "no-edit-access"                    | user does not have edit access                         |
| "edit-access"                       | user has edit access but policy is for non-editors     |
| "invalid-permission"                | permission is invalid                                  |
| "invalid-capability"                | capability is invalid                                  |
| "privilege-required"                | user does not have required privilege                  |
| "service-offline"                   | service is offline                                     |
| "service-maintenance"               | service is in maintenance mode                         |
| "service-not-available"             | service is not available in this environment           |
| "entity-required"                   | entity is required but not passed                      |
| "not-authenticated"                 | user is not authenticated                              |
| "not-alpha-org"                     | user is not in an alpha org                            |
| "not-beta-org"                      | user is not in a beta org                              |
| "property-missing"                  | assertion requires property but is missing from entity |
| "property-not-array"                | assertion requires array property                      |
| "array-contains-invalid-value"      | assertion specifies a value not be included            |
| "array-missing-required-value"      | assertion specifies a value not be included            |
| "property-mismatch"                 | assertion values do not match                          |
| "user-not-group-member"             | user is not a member of a specified group              |
| "user-not-group-manager"            | user is not a manager of a specified group             |
| "user-not-group-owner"              | user is not a owner of a specified group               |
| "assertion-property-not-found"      | assertion property was not found                       |
| "assertion-failed"                  | assertion condition was not met                        |
| "assertion-requires-numeric-values" | assertion requires numeric values                      |
| "feature-disabled"                  | feature has been disabled for the entity               |
| "feature-enabled"                   | feature has been enabled for the entity                |
| "not-in-environment"                | user is not in an allowed environment                  |
| "no-policy-exists"                  | policy is not defined for this permission              |
| "disabled-by-feature-flag"          | access denied due to a flag                            |
| "disabled-by-entity-flag"           | access denied due to a flag                            |
| "org-member"                        | user is member of granted org                          |
| "not-org-member"                    | user is not member of granted org                      |
| "group-member"                      | user is member of granted org                          |
| "not-group-member"                  | user is not member of granted group                    |
| "not-group-admin"                   | user is not admin member of granted group              |
| "is-user"                           | user is granted directly                               |
| "not-owner"                         | user is not the owner                                  |
| "not-licensed"                      | user is not licensed                                   |
| "not-licensed-available"            | user is not licensed, but could be                     |
| "not-available"                     | permission not available in this context               |
| "not-granted"                       | user does not have permission                          |
| "no-edit-access"                    | user does not have edit access                         |
| "edit-access"                       | user has edit access but policy is for non-editors     |
| "invalid-permission"                | permission is invalid                                  |
| "invalid-capability"                | capability is invalid                                  |
| "privilege-required"                | user does not have required privilege                  |
| "service-offline"                   | service is offline                                     |
| "service-maintenance"               | service is in maintenance mode                         |
| "service-not-available"             | service is not available in this environment           |
| "entity-required"                   | entity is required but not passed                      |
| "not-authenticated"                 | user is not authenticated                              |
| "not-alpha-org"                     | user is not in an alpha org                            |
| "not-beta-org"                      | user is not in a beta org                              |
| "property-missing"                  | assertion requires property but is missing from entity |
| "property-not-array"                | assertion requires array property                      |
| "array-contains-invalid-value"      | assertion specifies a value not be included            |
| "array-missing-required-value"      | assertion specifies a value not be included            |
| "property-mismatch"                 | assertion values do not match                          |
| "user-not-group-member"             | user is not a member of a specified group              |
| "user-not-group-manager"            | user is not a manager of a specified group             |
| "user-not-group-owner"              | user is not a owner of a specified group               |
| "assertion-property-not-found"      | assertion property was not found                       |
| "assertion-failed"                  | assertion condition was not met                        |
| "assertion-requires-numeric-values" | assertion requires numeric values                      |
| "feature-disabled"                  | feature has been disabled for the entity               |
| "feature-enabled"                   | feature has been enabled for the entity                |
| "not-in-environment"                | user is not in an allowed environment                  |
| "no-policy-exists";                 | policy is not defined for this permission              |
