---
title: Permissions and Access Controls
navTitle: Permissions
description: Checking Access
order: 30
group: 4-advanced
---

## Permissions and Access Controls

**NOTE: This guide is under active development**

### Quick Start

Client code can check permissions via entity classes `instance.checkPermission(permission)` or via free functions `checkPermission(permission, entity, context)`.

These calls are optimized as we expect client code to use these permission checks to determine a lot of UI behaviors. Currently these calls take less than a millisecond to complete.

```jsx
// Check individual permission
checkPermission("hub:events:create", entity, context);
//=> {permission: "hub:events:create", access: false, response: "not-group-member", checks: [{"hub:events:create", value: "group:00c", response:"not-group-member"}]}

// same function will be exposed on the class instances
site.checkPermission("hub:pages:create");
//=> {permission: "hub:pages:create", access: true, response: "group-member", checks: [{"hub:pages:create", value: "group:00c", response:"group-member"}]}
```

The key part of the response is the `access` which denotes if the user has been granted access. The rest of the response structure (`IAccessResponse`) provides deeper information about why access was granted or denied.

## Permissions Subsystem

ArcGIS Hub is a collaboration system, and thus determining what actions a user can takem, within a specific context is a common task.

Hub.js provides a Permission subsystem which combines platform level access controls (Portal Privileges, item edit access, group membership etc) with Hub business logic, to provide a single, seamless

## Permissions

A Permission is identified by a unique string, generally following this pattern:

`{namespace}:{capability-or-subsystem}:{action}:{sub-action}`

Examples: `hub:events:create` and `hub:project:edit`

The values are enforced by a typescript type, but effectively they can be anything, as long as they are unique, and consistent across the system.

### Permission Policies

A Permission Policy defines the platform (authentication, edit access, privileges) and hub product requirements (licensing) that must be met by a user before they can be granted access to a permission.

The `IPermissionPolicy` interface defines the structure. Permission Policies are built into Hub.js.

<img src="/hub.js/img/IPermissionPolicy.png" width="250px">

**Permission**: Permission Identifier. e.g. `hub:projects:create`

**Privileges**: Any Platform level privileges that may be required. e.g. `portal:user:createItem`

**entityOwner**: Does this policy require that the user be the owner of the entity?

**entityEditor**: Does this policy require that the user be able to edit the entity?

**licenses**: What Hub Licenses are required?

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

These policies are stored with the entity.

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

## System Status

In addition to being granted a permission, and having the necessary platform privs & licensing, the capability subsystem must be operational.

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

### Permission Storage

Entity Permissions are stored with the entity to which they apply.

The Permission Policies are defined at the system level and are stored either in Hub.js itself or could be served from an API.

Ideally we want the Hub system behavior to be “configurable by default” - meaning that if at all possible, we should design and build things to determine what a user can do, in any situation, by querying the permission system. This will enable the system to dynamically adapt to different licensing strategies
