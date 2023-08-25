---
title: Permissions and Access Controls
navTitle: Permissions
description: Checking Access
order: 19
group: 4-advanced
---

## Permissions

Permissions are defined by `IPermissionPolicy` objects, which are considered platform business rules. They are stored in the `<Entity>BusinessRules.ts` modules, and should not be exported from Hub.js.

For an overview of how permissons work, see the [Access Control Guide](../access-control)


### Permission Policy Properties

**Permission**: Permission Identifier. e.g. `hub:projects:create`

**dependencies**: Array of other permissions this permission depends on. This allows for the creation of hiearchies, with reduces duplication

**services**: What services must be online for this policy?

**authenticated**: must user be authenticated?

**privileges**: Any Platform level privileges that may be required. e.g. `portal:user:createItem`. User must have all specified privileges.

**entityOwner**: Does this policy require that the user be the owner of the entity?

**entityEdit**: Does this policy require that the user be able to edit the entity?

**licenses**: What Hub Licenses are required? Only specify this if the permission is limited to a subset of licenses. 

**availability**: `alpha`, `beta` or `general` availability.

**assertions**: additional checks that can address custom scenarios not covered by the other properties. (example shown below)

**entityConfigurable**: can an entity enable/disable this?

Please see the [`IPermissionPolicy` documentation](/hub.js/api/common/IPermissionPolicy/) for list of all available properties and theur detailed definitions.


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
    // example of an assertion used to implement an
    // entity specific rule
    assertions: [
      {
        // Access to this permission requires that the current user
        // is an admin of the followers group. To do that we
        // look up a property on the context
        property: "context:currentUser",
        // choose the type of assertion
        type: "is-group-admin",
        // look up a property from the entity
        value: "entity:followersGroupId",
        // see the IPolicyAssertion type for more information
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
    entityConfigurable: true
  },
]
```

### Entity Permission Policies

Entities can add additional "gating" for specific permissions. For example, a Site owner (`jsmith`) may choose to limit domain editing to themselves. So on the site entity, an `IEntityPermissionPolicy` would be added to the `.permissions` array, adding that conditition to the existing `IPermissionPolicy`

```js
site.permissions = [
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "jsmith"
  }
]
```

Entity Permission Policies are more limited than the full `IPermissionPolicy`, but they can cover a wide range of collaboration scenarios 

  - is the current user a member of a specified group?
  - is the current user a member of a specified org?
  - is the current user specifically granted access by name? (as shown above)

Entities can define many policies for the same permission, and only one of those needs to pass.

```js

// In this example jsmith or dvader will be granted access to hub:site:edit:domain
site.permissions = [
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "jsmith"
  },
  {
    permission: "hub:site:edit:domain",
    collaborationType: "user",
    collaborationId: "dvader"
  }
]
```

### Entity Features

Individual entities can disable "features" (which are represented by a permission). This is done by adding a key for the permission into the `entity.features` hash. Only permissions with `.entityConfigurable:true` will be read from this hash, ensuring general business rules can not be overridden.

```js
site.features = {
  // although the general business rules in the example above 
  // allow sites to have the chat "feature",
  // by adding an entry for that permission, we can turn it off
  "hub:site:workspace:chat": false
  // NOTE: these values are only read if the permission policy specifically
  // allows the permission to be "configured" by the entity
  // by specifying entityConfigurable:true
}
```

### System Feature Flags

Hub.js also supports system feature flags. These are passed into the `ArcGISContextManager.create(...)` as part of the options. The host application is responsible for parsing the values from the url.

System Feature Flags will override any Entity Feature flags, as well as the `availability` and `environment` checks. They can not be used to override license level checks, nor any core platform level privileges.

These are typically used to demonstrate upcoming features in customer Production orgs, despite the feature being gated to `qaext`.

Feature Flags are reset when the user formally signs out of the running application. 

### System Service Flags

As noted, Permission policies can list the services they depend upon (see the `hub:site:edit:domains` definition). In order to test our graceful degradation UX, we need a means to simulate a service being offline.

Similar to System Feature Flags, these are passed into `ArcGISContextManager.create(...)` as part of the options, and override the live status information.

Service Flags are reset when the user formally signs out of the running application. 

### Checking Permission Access

Permissions can be checked directly on an Entity instance via the `instance.checkPermission(permission)` method. If you don’t have access to an Entity Instance, the `checkPermission(permission, context, entity?)` function is also available.

```jsx
// Check individual permission
checkPermission("hub:events:create", entity, context);
//=> {permission: "hub:events:create", access: false, response: "not-group-member", checks: [{"hub:events:create", value: "group:00c", response:"not-group-member"}]}
// same function will be exposed on the class instances
site.checkPermission("hub:pages:create");
//=> {permission: "hub:pages:create", access: true, response: "group-member", checks: [{"hub:pages:create", value: "group:00c", response:"group-member"}]}
```

If the check does not grant access, the entire check is logged to the console.

Both return an `IPermissionAccessResponse` . The most important property is `.access` which indicates if the current user has access to the capability. The other properties are for debugging and observability into why the system is returning the `.access` value, and can be used to display different messages to the user.

For example, the `.result` property will be `granted` if access is allowed, but if access is denied, it will be a more informative value. 

The table below lists all the values, but likely the two most important are:

**not-licensed-available** which means the feature is available, but user lacks a license. This is an opportunity to show an upgrade call-to-action

**service-offline** a required service is currently offline. Application can choose to show a general error message, or continue with a gracefully degraded experience.

**service-not-available** this means that the service is simply not available in the current environment. This is a good means to gate access to a feature that's not currently in Enterprise, but which we could add over time.

Most of the rest of the values are specific to some policy check failing.

| `result` Value | Description |
| --- | --- | 
| "granted" | user has access |
  | "disabled-by-feature-flag" | access denied due to a flag |
  | "disabled-by-entity-flag" | access denied due to a flag |
  | "org-member" | user is member of granted org |
  | "not-org-member" | user is not member of granted org |
  | "group-member" | user is member of granted org |
  | "not-group-member" | user is not member of granted group |
  | "not-group-admin" | user is not admin member of granted group |
  | "is-user" | user is granted directly |
  | "not-owner" | user is not the owner |
  | "not-licensed" | user is not licensed |
  | "not-licensed-available" | user is not licensed, but could be |
  | "not-available" | permission not available in this context |
  | "not-granted" | user does not have permission |
  | "no-edit-access" | user does not have edit access |
  | "edit-access" | user has edit access but policy is for non-editors |
  | "invalid-permission" | permission is invalid |
  | "invalid-capability" | capability is invalid |
  | "privilege-required" | user does not have required privilege |
  | "service-offline" | service is offline |
  | "service-maintenance" | service is in maintenance mode |
  | "service-not-available" | service is not available in this environment |
  | "entity-required" | entity is required but not passed |
  | "not-authenticated" | user is not authenticated |
  | "not-alpha-org" | user is not in an alpha org |
  | "not-beta-org" | user is not in a beta org |
  | "property-missing" | assertion requires property but is missing from entity |
  | "property-not-array" | assertion requires array property |
  | "array-contains-invalid-value" | assertion specifies a value not be included |
  | "array-missing-required-value" | assertion specifies a value not be included |
  | "property-mismatch" | assertion values do not match |
  | "user-not-group-member" | user is not a member of a specified group |
  | "user-not-group-manager" | user is not a manager of a specified group |
  | "user-not-group-owner" | user is not a owner of a specified group |
  | "assertion-property-not-found" | assertion property was not found |
  | "assertion-failed" | assertion condition was not met |
  | "assertion-requires-numeric-values" | assertion requires numeric values |
  | "feature-disabled" | feature has been disabled for the entity |
  | "feature-enabled" | feature has been enabled for the entity |
  | "not-in-environment" | user is not in an allowed environment |
  | "no-policy-exists"; | policy is not defined for this permission |



