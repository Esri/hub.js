---
title: Access Control
navTitle: Access Control
description: Checking Access to Features
order: 10
group: 4-advanced
---

## Access Control in ArcGIS Hub

ArcGIS Hub is a collaboration system, so determining what actions a user can take within a specific context is a common task, known as "access control."

In Hub, access control is managed via **Permissions**.

There are five elements in the Permission system:

- **Permission Policies** — business rules embedded in the system
- **Entity Permission Policies** — additional entity-specific rules that further limit access
- **Entity Feature Flags** — entity-specific means to disable a feature
- **System Feature Flags** — global overrides for specific permissions
- **System Service Flags** — globally disable a service to test graceful degradation UX

For details, see the [Permissions Guide](../permissions).

# Desiging Permissions

## Premium Features

Work with a Product Engineer to choose a permission string, and add it to the `{Entity}BusinessRules.ts` module.

## Gated Releases

The Hub System Permissions will have ArcGIS Online release permissions pre-defined. To setup your feature to automatically release with the platform release, add that permission to your permissions `dependencies` array. During development, leave in `availability: ["qaext"]` etc, but once dev complete, remove those

```js
{
  permission: "hub:group:messaging",
  dependencies: ["hub:release:2026R1"],
  licenses: ["hub-premium"],
  services: ["portal"]
}
```

With this in place, and merged, we can then use `?pe=hub:release:20206R1` to enable that whole set of features at once.

If your feature does not need to ship with a platform release, but also needs some additional time for docs, translations, customer outreach etc, we can also release on a future date. Coordinate with Product Engineers and Product Management to chose the date, and add it to your permission,

```js
{
  permission: "hub:group:messaging",
  releaseAfter: "2025-10-25T17:00:00.000Z",
  licenses: ["hub-premium"],
  services: ["portal"]
}
```

While using dates is powerful, to preview the functionality in production, you would need to use `?pe=hub:group:messaging`. If there is a group of functionality being released on a specific date, create a system level permission (`hub:release:20251025`) and set that as a depenency for multiple permissions.

## Opt-In Previews

In scenarios where we want to have a user "opt-in" followed by a general release, with an "opt-out", followed by everyone being forced into the new behavior, please see the [Permissions](./permissions.md) guide for details. This is complex, and requires a lot of change mangement, so this must be coordinated with Product Management.

## High-Level Model

To determine if a user can take a specific action in a given context, the application calls `checkPermission(...): IPermissionAccessResponse`. The key property on the response is `.access: boolean`, but the response also includes information about all checks that were applied and the reason access was denied, enabling a variety of messages or behaviors.

The `checkPermission(...)` call considers:

- Status of any services the permission depends on
- Availability checks (`alpha`, `beta`, `general`)
- Environment checks (`devext`, `qaext`, `production`, `enterprise-sites`)
- Release gating (to coordinate with a Platform release or a specific date)
- Authentication status
- Platform privileges
- Whether the user is the owner of the entity
- Whether the user has edit access to the entity
- Entity-specific feature flags
- System feature flags
- Overrides passed into the app via query params (`pe=permission:to:enable` or `pd=permission:to:disable`)

## General Logic (No Entity Provided)

`checkPermission(permission, context): IPermissionAccessResponse`

1. Is this a valid permission?
2. Is there a system policy defined for this permission?
3. Is there a system feature flag set for this permission?
   - Hold that flag value, overriding any set by the entity
4. If a flag value is set and it's `false`:
   - Return `access: false, reason: "disabled-by-<entity|feature>-flag"`
5. If a flag value is set and it's `true`:
   - Run all checks except `availability`, `environment`, and `release gating`
6. If no flag is set, run all checks
7. Aggregate all policy checks to determine if access is granted
8. Return `IPermissionAccessResponse`

## General Logic (Entity Provided)

`checkPermission(permission, context, entity): IPermissionAccessResponse`

1. Is this a valid permission?
2. Is there a system policy defined for this permission?
3. If `.entityConfigurable: true` on the policy:
   - Does `entity.features` have a flag for this permission?
     - Hold that flag value
4. Is there a system feature flag set for this permission?
   - Hold that flag value, overriding any set by the entity
5. If a flag value is set and it's `false`:
   - Return `access: false, reason: "disabled-by-<entity|feature>-flag"`
6. If a flag value is set and it's `true`:
   - Run all checks except `availability` and `environment`
7. If no flag is set, run all checks
8. Aggregate all policy checks to determine if access is granted
9. Is there an Entity Policy for this permission?
   - Run all Entity Policy checks
   - If no policy checks pass, access is denied
10. Return `IPermissionAccessResponse`

### Developer Guidance

As we build the next generation of ArcGIS Hub, we want behavior to be “configurable by default.” Design and build the UI layer by querying the Permissions subsystem, rather than implementing custom checks in-place. This enables the system to adapt to different licensing or packaging strategies simply by changing business rules, instead of making sweeping code changes.

## Overriding Permissions in Hub Applications

To flex certain conditions in the application, Hub applications can be passed query params to enable or disable individual permissions. This is supported in both Ember and React applications. The host application is responsible for extracting the params, passing them into the `ArcGISContextManager`, and removing the params from the URI once processed.

### Enabling Permissions

To enable a permission, pass `?pe=permission:to:enable`. This only overrides the `environment` and `availability` checks—useful for verifying behavior gated to QA on PROD before full release. This cannot be used to circumvent license, privilege, or group membership checks.

### Disabling Permissions

To disable a permission, pass `?pd=permission:to:disable`. Unlike enabling, any permission may be disabled regardless of its definition. In this case, `checkPermission` will return `{ access: false, reason: "disabled-by-<feature>-flag", ... }`.
