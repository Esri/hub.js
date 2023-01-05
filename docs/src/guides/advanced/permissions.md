---
title: Permissions and Access Controls
navTitle: Permissions
description: Checking Access
order: 40
group: 4-advanced
---

## Permissions

A Permission is a lower-level check than a [Capability](../capabilities). They can be system level, (checking if the user can create a new entity), or entity level, (checking if user can take some action related to the entity).

Permissions are referenced by pre-defined string values such as `"hub:site:create", "hub:project:delete"`etc. Please see the `Permission` type definition for the complete set of values

A user is granted access if they:

- meet all the system-level requirements for the permission
  - is the required subsystem operational?
  - are the license requirements met?
  - are the platform access control requirements met?
- meet at least one of the entity-level requirements (if defined) for the permission
  - is the user a member of a specified group?
  - is the user a member of a specified org?
  - is the user specifically granted access by name?

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

Both return an `IPermissionAccessResponse` . The most important property is `.access` which indicates if the current user has access to the capability. The other properties are for debugging and observability into why the system is returning the `.access` value, and can be used to display different messages to the user.

### Defining Permissions

Permissions are defined on a per-entity basis, in the `<EntityType>BusinessRules` modules.

They are made up of two parts:

- a string identifier e.g. `hub:site:create`, following the general pattern `{namespace}:{entity-or-subsystem}:{action}:{sub-action}`
- a `IPermissionPolicy` which defines the requirements for access

To define a new permission, the permission string must be added to the `<EntityType>Permissions` array (e.g. `SitePermissions`) and then the associated `IPermissionPolicy` must be added to the `<EntityType>PermissionPolicies` array.

### Permission Policies

An `IPermissionPolicy` defines the business rules that must be met in order for a user to be granted access. The current user must meet all these requirements, after which, entity level policies will be checked.

```jsx
// Example definition
const createSitePolicy: IPermissionPolicy = {
  permission: "hub:site:create",
  subsystems: ["sites"],
  authenticated: true,
  privileges: ["portal:user:createItem"],
  licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
};
```

<img src="/hub.js/img/IPermissionPolicy.png" width="250px">

**Permission**: Permission Identifier. e.g. `hub:projects:create`

**Subsystems**: What subsystems must be online for this policy?

**Authenticated**: must user be authenticated?

**Privileges**: Any Platform level privileges that may be required. e.g. `portal:user:createItem`

**entityOwner**: Does this policy require that the user be the owner of the entity?

**entityEditor**: Does this policy require that the user be able to edit the entity?

**licenses**: What Hub Licenses are required?

**alpha**: Is this restricted to alpha organizations?

**assertions**: additional checks that can address custom scenarios not covered by the other properties.

Please see the [`IPermissionPolicy` documentation](/hub.js/api/common/IPermissionPolicy/) for list of all available properties and theur detailed definitions.

### Example Permission Policies

```jsx
[
  {
    permission: "hub:projects:create",
    privileges: ["portal:user:createItem"],
    entityOwner: false,
    entityEditor: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:projects:delete",
    privileges: [],
    entityOwner: true,
    entityEditor: false,
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:projects:editCapabilities",
    privileges: [],
    entityOwner: false,
    entityEditor: true,
    licenses: ["hub-premium"],
  },
];
```

For some application level permissions - i.e. `hub:create:site`, is all that’s needed because Sites are not created in the context of any other “entities”.

### Entity Permission Policies

Most permissions are context specific - `hub:site:edit` only makes sense in the context of a specific site entity. The Entity Permission Policy defines additional checks.

These policies are stored with the entity, and are checked after the system policies.

**Entity Permission Policies** are treated as “grants”, in that the user only needs to satisfy one of the conditions (in addition to the Permission Policies)

<img src="/hub.js/img/IEntityPermissionPolicy.png" width="250px">

### Entity Permission Structure

**Permission**: What is being managed?

**CollaborationType**: Type of the context the grant is applied to - e.g. `user| group | org`

**CollaborationId:** Identifier of what the grant applies to e.g. `jsmith` or `7deb8b7bdb4f4fab973513ebb55cd9a6`

### Example Entity Permission Policies

```jsx
[
  {
    id: "hub:sites:create",
    collaborationType: "org",
    collaborationId: "BK0",
  },
  {
    id: "hub:projects:create",
    collaborationType: "item",
    collaborationId: "00c",
  },
];
```

The entity permission policies are stored in `data.permissions` and are automatically merged with the ArcGIS Hub Permission business rules at run-time.

In the future, the “Collaboration” UX will be used to define Entity Permission Policies. Until that is available, for Sites we are utilizing a run-time migration which generates an Entity Permission Policy, granting access to `hub:site:edit` permission to members of the collaboration group associated with the Site.

## System Status

In addition to being granted a permission, and having the necessary platform privileges & licensing, the underlying subsystem must be operational.

For example, a permission like `hub:sites:manageDomains` needs to verify that the user has edit access to the Site item that’s the context, **_and_** that the System supports the domains service, **_and_** that it is operational.

```jsx
[
  {
    subsystem: "sites",
    status: "online",
  },
  {
    subsystem: "domains",
    status: "online",
  },
  {
    subsystem: "events",
    status: "not-available",
  },
];
```

For the first release, the system status is constructed by the host application, but eventually it will be fetched from the Hub API.
